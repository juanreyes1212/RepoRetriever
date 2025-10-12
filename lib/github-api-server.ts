interface RateLimitHeaders {
  remaining: number;
  reset: number;
  limit: number;
}

export class GitHubAPIClient {
  private token: string;
  private baseURL = "https://api.github.com";

  constructor(token: string) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{
    data: T;
    rateLimit: RateLimitHeaders;
  }> {
    const url = endpoint.startsWith("http")
      ? endpoint
      : `${this.baseURL}${endpoint}`;

    const headers = {
      Authorization: `Bearer ${this.token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const rateLimit: RateLimitHeaders = {
      remaining: parseInt(response.headers.get("X-RateLimit-Remaining") || "0"),
      reset: parseInt(response.headers.get("X-RateLimit-Reset") || "0"),
      limit: parseInt(response.headers.get("X-RateLimit-Limit") || "5000"),
    };

    if (response.status === 429) {
      const retryAfter = response.headers.get("Retry-After");
      throw new Error(
        `Rate limit exceeded. Retry after ${retryAfter || rateLimit.reset} seconds`
      );
    }

    if (response.status === 403) {
      const retryAfter = response.headers.get("Retry-After");
      if (retryAfter) {
        throw new Error(
          `Secondary rate limit hit. Retry after ${retryAfter} seconds`
        );
      }
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || `GitHub API error: ${response.statusText}`
      );
    }

    const data = await response.json();
    return { data, rateLimit };
  }

  async get<T>(endpoint: string): Promise<{ data: T; rateLimit: RateLimitHeaders }> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(
    endpoint: string,
    body: any
  ): Promise<{ data: T; rateLimit: RateLimitHeaders }> {
    return this.request<T>(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }

  async patch<T>(
    endpoint: string,
    body: any
  ): Promise<{ data: T; rateLimit: RateLimitHeaders }> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }

  async put<T>(
    endpoint: string,
    body?: any
  ): Promise<{ data: T; rateLimit: RateLimitHeaders }> {
    return this.request<T>(endpoint, {
      method: "PUT",
      headers: body
        ? {
            "Content-Type": "application/json",
          }
        : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<{ data: T; rateLimit: RateLimitHeaders }> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  async getUser() {
    return this.get<{
      login: string;
      id: number;
      name: string;
      email: string;
    }>("/user");
  }

  async getUserRepos() {
    return this.get<
      Array<{
        id: number;
        name: string;
        full_name: string;
        private: boolean;
      }>
    >("/user/repos?per_page=100");
  }
}
