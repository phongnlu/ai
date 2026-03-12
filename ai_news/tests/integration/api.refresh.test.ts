import { POST } from '@/app/api/refresh/route';
import { createArticle } from '../mocks/articleFactory';

const mockRunPipeline = jest.fn();
jest.mock('@/agents/pipeline', () => ({ runPipeline: () => mockRunPipeline() }));

describe('POST /api/refresh', () => {
  it('returns success with count and updatedAt', async () => {
    const articles = [createArticle(), createArticle()];
    mockRunPipeline.mockResolvedValue(articles);

    const res = await POST();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.count).toBe(2);
    expect(data.updatedAt).toBeTruthy();
  });

  it('returns 500 on pipeline error', async () => {
    mockRunPipeline.mockRejectedValue(new Error('RSS fetch failed'));

    const res = await POST();
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toBe('RSS fetch failed');
  });
});
