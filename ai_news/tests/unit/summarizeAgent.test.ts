import { summarizeArticles } from '@/agents/summarizeAgent';
import { createArticle } from '../mocks/articleFactory';
import { createMockAnthropicClient } from '../mocks/claudeMock';

jest.mock('@/config/env', () => ({ ANTHROPIC_API_KEY: 'test-key' }));

const mockCreate = jest.fn();
jest.mock('@anthropic-ai/sdk', () =>
  jest.fn().mockImplementation(() => ({ messages: { create: mockCreate } }))
);

beforeEach(() => {
  mockCreate.mockResolvedValue(createMockAnthropicClient().messages.create());
});

describe('summarizeAgent', () => {
  it('populates article.summary from Claude response', async () => {
    const articles = [createArticle({ summary: '' })];
    const result = await summarizeArticles(articles);
    expect(result[0].summary).toBeTruthy();
    expect(result[0].summary.length).toBeGreaterThan(10);
  });

  it('assigns a valid category from Claude response', async () => {
    const articles = [createArticle()];
    const result = await summarizeArticles(articles);
    expect(['research', 'product', 'policy', 'open-source']).toContain(result[0].category);
  });

  it('uses fallback when Claude API throws', async () => {
    mockCreate.mockRejectedValueOnce(new Error('API error'));
    const article = createArticle({ summary: 'Original summary text' });
    const result = await summarizeArticles([article]);
    expect(result[0].summary).toBe('Original summary text');
  });

  it('estimates readTimeMinutes from summary word count', async () => {
    const articles = [createArticle()];
    const result = await summarizeArticles(articles);
    expect(result[0].readTimeMinutes).toBeGreaterThanOrEqual(1);
  });
});
