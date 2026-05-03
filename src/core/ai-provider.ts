import type { AIProviderRequest, AIProviderResponse } from "./types";

export interface AIProvider {
  readonly name: string;
  suggestKeywords(request: AIProviderRequest): Promise<AIProviderResponse>;
}

export class UnconfiguredAIProvider implements AIProvider {
  readonly name = "unconfigured";

  async suggestKeywords(): Promise<AIProviderResponse> {
    return {
      entries: [],
      provider: this.name,
      cached: false,
      error: "AI provider is reserved for a future milestone."
    };
  }
}
