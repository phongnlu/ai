export const mockRssFeedXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>AI News Test Feed</title>
    <link>https://example.com</link>
    <description>Mock RSS feed for testing</description>
    <item>
      <title>GPT-5 Achieves Human-Level Reasoning</title>
      <link>https://example.com/gpt5</link>
      <description>OpenAI releases GPT-5 with breakthrough reasoning capabilities.</description>
      <pubDate>Fri, 06 Mar 2026 10:00:00 GMT</pubDate>
    </item>
    <item>
      <title>Claude 4 Tops New AI Safety Benchmarks</title>
      <link>https://example.com/claude4</link>
      <description>Anthropic's latest model sets records on safety evals.</description>
      <pubDate>Thu, 05 Mar 2026 10:00:00 GMT</pubDate>
    </item>
    <item>
      <title>EU AI Act Enforcement Begins</title>
      <link>https://example.com/eu-ai-act</link>
      <description>The European Union begins enforcing AI regulations across member states.</description>
      <pubDate>Wed, 04 Mar 2026 10:00:00 GMT</pubDate>
    </item>
    <item>
      <title>Hugging Face Launches Open LLM Leaderboard v3</title>
      <link>https://example.com/hf-leaderboard</link>
      <description>New open-source model rankings with stricter evaluation criteria.</description>
      <pubDate>Tue, 03 Mar 2026 10:00:00 GMT</pubDate>
    </item>
    <item>
      <title>Google DeepMind Releases Gemini Ultra 2</title>
      <link>https://example.com/gemini-ultra-2</link>
      <description>Multimodal AI model with improved code generation and reasoning.</description>
      <pubDate>Mon, 02 Mar 2026 10:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>`;

export const mockParsedFeed = {
  title: 'AI News Test Feed',
  link: 'https://example.com',
  items: [
    { title: 'GPT-5 Achieves Human-Level Reasoning', link: 'https://example.com/gpt5', contentSnippet: 'OpenAI releases GPT-5 with breakthrough reasoning capabilities.', pubDate: 'Fri, 06 Mar 2026 10:00:00 GMT' },
    { title: 'Claude 4 Tops New AI Safety Benchmarks', link: 'https://example.com/claude4', contentSnippet: "Anthropic's latest model sets records on safety evals.", pubDate: 'Thu, 05 Mar 2026 10:00:00 GMT' },
    { title: 'EU AI Act Enforcement Begins', link: 'https://example.com/eu-ai-act', contentSnippet: 'The European Union begins enforcing AI regulations.', pubDate: 'Wed, 04 Mar 2026 10:00:00 GMT' },
  ],
};
