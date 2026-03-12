import { filterArticles } from '@/agents/filterAgent';
import { createArticle } from '../mocks/articleFactory';

jest.mock('@anthropic-ai/sdk', () => {
  return jest.fn().mockImplementation(() => ({
    messages: { create: jest.fn().mockResolvedValue({ content: [{ type: 'text', text: 'yes' }] }) },
  }));
});
jest.mock('@/config/env', () => ({ ANTHROPIC_API_KEY: 'test-key' }));

describe('filterAgent', () => {
  it('passes high-scoring AI articles without Claude check', async () => {
    const article = createArticle({ title: 'GPT-5 LLM neural model benchmark', summary: 'AI training deep learning transformer.' });
    const result = await filterArticles([article]);
    expect(result).toHaveLength(1);
  });

  it('drops zero-score articles', async () => {
    const article = createArticle({ title: 'Recipe: chocolate chip cookies', summary: 'Bake at 350 degrees for 12 minutes.' });
    const result = await filterArticles([article]);
    expect(result).toHaveLength(0);
  });

  it('calls Claude for borderline articles (score 1-2)', async () => {
    const Anthropic = require('@anthropic-ai/sdk');
    const mockCreate = jest.fn().mockResolvedValue({ content: [{ type: 'text', text: 'yes' }] });
    Anthropic.mockImplementation(() => ({ messages: { create: mockCreate } }));

    const article = createArticle({ title: 'New technology model released', summary: 'A software update was shipped today.' });
    await filterArticles([article]);
    // Claude should be called for borderline scoring
    expect(mockCreate).toHaveBeenCalled();
  });

  it("drops article when Claude responds 'no'", async () => {
    const Anthropic = require('@anthropic-ai/sdk');
    Anthropic.mockImplementation(() => ({
      messages: { create: jest.fn().mockResolvedValue({ content: [{ type: 'text', text: 'no' }] }) },
    }));
    const article = createArticle({ title: 'Model train arrives at station', summary: 'A transport update was issued.' });
    const result = await filterArticles([article]);
    expect(result).toHaveLength(0);
  });
});
