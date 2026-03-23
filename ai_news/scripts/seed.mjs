#!/usr/bin/env node
/**
 * Seed script — fetches real RSS articles and saves to data/articles.json
 * Run: node scripts/seed.mjs
 *
 * - Fetches from all configured RSS sources
 * - Deduplicates by URL
 * - Filters by AI keyword score (no Claude call needed for pass/fail)
 * - Calls Claude to summarize and categorize each article
 * - Saves to data/articles.json and public/feed.xml
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';
import Anthropic from '@anthropic-ai/sdk';
import RSSParser from 'rss-parser';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

// Load env
const envPath = path.join(ROOT, '.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf-8').split('\n').forEach(line => {
    const [k, ...v] = line.split('=');
    if (k && v.length) process.env[k.trim()] = v.join('=').trim();
  });
}

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
if (!ANTHROPIC_API_KEY) { console.error('Missing ANTHROPIC_API_KEY'); process.exit(1); }

const RSS_SOURCES = [
  { name: 'Hacker News AI',      url: 'https://hnrss.org/newest?q=AI+LLM&count=50' },
  { name: 'ArXiv cs.AI',         url: 'https://rss.arxiv.org/rss/cs.AI' },
  { name: 'MIT Tech Review',     url: 'https://www.technologyreview.com/feed/' },
  { name: 'VentureBeat AI',      url: 'https://venturebeat.com/category/ai/feed/' },
  { name: 'The Verge AI',        url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml' },
  // Claude / Anthropic
  { name: 'Anthropic News',      url: 'https://www.anthropic.com/rss.xml' },
  { name: 'Hacker News Claude',  url: 'https://hnrss.org/newest?q=Claude+Anthropic&count=30' },
  // OpenAI / ChatGPT / Codex
  { name: 'OpenAI News',         url: 'https://openai.com/news/rss.xml' },
  { name: 'Hacker News ChatGPT', url: 'https://hnrss.org/newest?q=ChatGPT+OpenAI+Codex&count=30' },
  // Google Gemini
  { name: 'Google DeepMind Blog', url: 'https://deepmind.google/blog/rss.xml' },
  { name: 'Hacker News Gemini',  url: 'https://hnrss.org/newest?q=Gemini+Google+AI&count=30' },
];

const AI_KEYWORDS = [
  'ai', 'llm', 'machine learning', 'neural', 'gpt', 'claude', 'gemini',
  'transformer', 'artificial intelligence', 'deep learning', 'openai',
  'anthropic', 'hugging face', 'inference', 'training', 'benchmark',
  'agent', 'diffusion', 'multimodal', 'embedding', 'fine-tun', 'chatbot', 'generative',
  'claude code', 'codex', 'copilot', 'cursor', 'deepmind',
  'chatgpt', 'gpt-4', 'gpt-5', 'o1', 'o3', 'sonnet', 'opus', 'mistral',
  'llama', 'deepseek', 'reasoning model', 'context window',
];

const VALID_CATEGORIES = ['research', 'product', 'policy', 'open-source'];

const parser = new RSSParser();
const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

function score(title, snippet) {
  const t = title.toLowerCase(), s = (snippet ?? '').toLowerCase();
  return AI_KEYWORDS.reduce((n, kw) => n + (t.includes(kw) ? 2 : 0) + (s.includes(kw) ? 1 : 0), 0);
}

async function fetchAll() {
  const seen = new Set();
  const articles = [];
  await Promise.allSettled(RSS_SOURCES.map(async src => {
    try {
      const feed = await parser.parseURL(src.url);
      for (const item of (feed.items ?? [])) {
        const url = item.link ?? item.guid;
        if (!url || seen.has(url)) continue;
        seen.add(url);
        if (score(item.title ?? '', item.contentSnippet ?? '') < 1) continue;
        articles.push({
          id: randomUUID(),
          title: item.title ?? 'Untitled',
          rawSnippet: item.contentSnippet ?? item.content ?? '',
          source: src.name,
          sourceUrl: url,
          publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
          imageUrl: item.enclosure?.url ?? null,
          tags: [],
        });
      }
      console.log(`  ✓ ${src.name} — fetched ${feed.items?.length ?? 0} items`);
    } catch (e) {
      console.warn(`  ✗ ${src.name}: ${e.message}`);
    }
  }));
  return articles;
}

async function summarize(article) {
  try {
    const msg = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: `Summarize this article in 2-3 sentences for a tech-savvy audience. Classify it as one of: research, product, policy, open-source.

Title: ${article.title}
Content: ${article.rawSnippet.slice(0, 800)}

Respond with JSON only: {"summary":"...","category":"..."}`,
      }],
    });
    const raw = msg.content[0].text.trim().replace(/^```json\n?|\n?```$/g, '');
    const json = JSON.parse(raw);
    const category = VALID_CATEGORIES.includes(json.category) ? json.category : 'product';
    const summary = json.summary || article.rawSnippet.slice(0, 200);
    return { ...article, summary, category, readTimeMinutes: Math.max(1, Math.ceil(summary.split(' ').length / 200)), rawSnippet: undefined };
  } catch {
    return { ...article, summary: article.rawSnippet.slice(0, 200), category: 'product', readTimeMinutes: 1, rawSnippet: undefined };
  }
}

async function buildFeed(articles) {
  const items = articles.map(a => `  <item>
    <title><![CDATA[${a.title}]]></title>
    <link>${a.sourceUrl}</link>
    <guid>${a.sourceUrl}</guid>
    <pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>
    <category>${a.category}</category>
    <description><![CDATA[${a.summary}]]></description>
  </item>`).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>AI News Feed</title>
    <link>http://localhost:3000</link>
    <description>Curated AI news with Claude-powered summaries</description>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  fs.writeFileSync(path.join(ROOT, 'public', 'feed.xml'), xml, 'utf-8');
}

(async () => {
  console.log('\n🔍 Fetching RSS sources...');
  const raw = await fetchAll();
  console.log(`\n📰 Fetched ${raw.length} AI-relevant articles\n`);

  // Limit to 30 to avoid excessive API calls
  const toSummarize = raw.slice(0, 30);
  console.log(`🤖 Summarizing ${toSummarize.length} articles with Claude...\n`);

  const results = [];
  for (let i = 0; i < toSummarize.length; i++) {
    const a = toSummarize[i];
    process.stdout.write(`  [${i + 1}/${toSummarize.length}] ${a.title.slice(0, 60)}... `);
    const summarized = await summarize(a);
    results.push(summarized);
    console.log(`✓ [${summarized.category}]`);
  }

  const dataPath = path.join(ROOT, 'data', 'articles.json');
  fs.writeFileSync(dataPath, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`\n✅ Saved ${results.length} articles to data/articles.json`);

  await buildFeed(results);
  console.log('✅ Wrote public/feed.xml\n');
})();
