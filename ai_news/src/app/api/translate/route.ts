import { NextRequest, NextResponse } from 'next/server';

const LANG_CODES: Record<string, string> = {
  zh: 'zh-CN',
  vi: 'vi',
};

async function translateText(text: string, targetLang: string): Promise<string> {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const data = await res.json();
  // Response: [[[translated, original, ...], ...], ...]
  const translated = (data[0] as [string, string][]).map(([t]) => t).join('');
  if (!translated) throw new Error('Empty translation response');
  return translated;
}

export async function POST(req: NextRequest) {
  try {
    const { articles, targetLang } = await req.json() as {
      articles: { id: string; sourceUrl: string; title: string; summary: string }[];
      targetLang: string;
    };

    const lang = LANG_CODES[targetLang];
    if (!lang || !articles?.length) {
      return NextResponse.json({ translations: {} }, { status: 400 });
    }

    const translations: Record<string, { title: string; summary: string }> = {};

    for (const a of articles) {
      try {
        const key = a.sourceUrl || a.id;
        const title = await translateText(a.title, lang);
        const summary = a.summary ? await translateText(a.summary.slice(0, 500), lang) : '';
        translations[key] = { title, summary };
      } catch (err) {
        console.error(`[translate] Failed for article ${a.id}:`, err);
        const key = a.sourceUrl || a.id;
        translations[key] = { title: a.title, summary: a.summary };
      }
    }

    return NextResponse.json({ translations });
  } catch (err) {
    console.error('[translate] Error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
