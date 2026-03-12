export function createMockAnthropicClient(overrides?: { text?: string }) {
  const text = overrides?.text ?? JSON.stringify({
    summary: 'This article discusses major advances in large language models and their applications. Researchers demonstrate improved reasoning capabilities across multiple benchmarks. The findings have significant implications for AI deployment in enterprise settings.',
    category: 'research',
  });

  return {
    messages: {
      create: jest.fn().mockResolvedValue({
        id: 'msg_mock',
        type: 'message',
        role: 'assistant',
        content: [{ type: 'text', text }],
        model: 'claude-sonnet-4-6',
        stop_reason: 'end_turn',
        usage: { input_tokens: 100, output_tokens: 50 },
      }),
    },
  };
}
