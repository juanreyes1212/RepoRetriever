export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string;
  email: string;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  default_branch: string;
}

export interface GitHubIssue {
  id: number;
  number: number;
  html_url: string;
  state: string;
}

export interface GitHubPullRequest {
  id: number;
  number: number;
  html_url: string;
  state: string;
  merged: boolean;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  used: number;
}

export class GitHubAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public rateLimitInfo?: RateLimitInfo
  ) {
    super(message);
    this.name = 'GitHubAPIError';
  }
}

export class GitHubAPI {
  private baseUrl = 'https://api.github.com';
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: HeadersInit = {
      'Authorization': `Bearer ${this.token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const rateLimitInfo: RateLimitInfo = {
        limit: parseInt(response.headers.get('X-RateLimit-Limit') || '0'),
        remaining: parseInt(response.headers.get('X-RateLimit-Remaining') || '0'),
        reset: parseInt(response.headers.get('X-RateLimit-Reset') || '0'),
        used: parseInt(response.headers.get('X-RateLimit-Used') || '0'),
      };

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || response.statusText;

        if (response.status === 403 && rateLimitInfo.remaining === 0) {
          const resetDate = new Date(rateLimitInfo.reset * 1000);
          throw new GitHubAPIError(
            `Rate limit exceeded. Resets at ${resetDate.toLocaleTimeString()}`,
            response.status,
            rateLimitInfo
          );
        }

        throw new GitHubAPIError(errorMessage, response.status, rateLimitInfo);
      }

      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof GitHubAPIError) {
        throw error;
      }

      if (error instanceof TypeError) {
        throw new GitHubAPIError('Network error. Please check your connection.');
      }

      throw new GitHubAPIError(
        error instanceof Error ? error.message : 'Unknown error occurred'
      );
    }
  }

  async validateToken(): Promise<GitHubUser> {
    return this.makeRequest<GitHubUser>('/user');
  }

  async checkTokenScopes(): Promise<string[]> {
    const response = await fetch(`${this.baseUrl}/user`, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    });

    const scopes = response.headers.get('X-OAuth-Scopes');
    return scopes ? scopes.split(',').map(s => s.trim()) : [];
  }

  async createRepository(name: string, description: string): Promise<GitHubRepository> {
    return this.makeRequest<GitHubRepository>('/user/repos', {
      method: 'POST',
      body: JSON.stringify({
        name,
        description,
        auto_init: true,
        private: false,
      }),
    });
  }

  async deleteRepository(owner: string, repo: string): Promise<void> {
    await this.makeRequest(`/repos/${owner}/${repo}`, {
      method: 'DELETE',
    });
  }

  async getFileContent(owner: string, repo: string, path: string): Promise<any> {
    return this.makeRequest(`/repos/${owner}/${repo}/contents/${path}`);
  }

  async updateFile(
    owner: string,
    repo: string,
    path: string,
    content: string,
    message: string,
    sha?: string,
    branch?: string
  ): Promise<any> {
    const body: any = {
      message,
      content: Buffer.from(content).toString('base64'),
    };

    if (sha) {
      body.sha = sha;
    }

    if (branch) {
      body.branch = branch;
    }

    return this.makeRequest(`/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async createBranch(
    owner: string,
    repo: string,
    branchName: string,
    fromBranch: string
  ): Promise<any> {
    const refResponse = await this.makeRequest<any>(
      `/repos/${owner}/${repo}/git/ref/heads/${fromBranch}`
    );

    return this.makeRequest(`/repos/${owner}/${repo}/git/refs`, {
      method: 'POST',
      body: JSON.stringify({
        ref: `refs/heads/${branchName}`,
        sha: refResponse.object.sha,
      }),
    });
  }

  async createPullRequest(
    owner: string,
    repo: string,
    title: string,
    head: string,
    base: string,
    body?: string
  ): Promise<GitHubPullRequest> {
    return this.makeRequest<GitHubPullRequest>(`/repos/${owner}/${repo}/pulls`, {
      method: 'POST',
      body: JSON.stringify({
        title,
        head,
        base,
        body: body || '',
      }),
    });
  }

  async mergePullRequest(
    owner: string,
    repo: string,
    pullNumber: number,
    commitMessage?: string
  ): Promise<any> {
    return this.makeRequest(`/repos/${owner}/${repo}/pulls/${pullNumber}/merge`, {
      method: 'PUT',
      body: JSON.stringify({
        commit_message: commitMessage || 'Merge pull request',
        merge_method: 'merge',
      }),
    });
  }

  async createIssue(
    owner: string,
    repo: string,
    title: string,
    body?: string
  ): Promise<GitHubIssue> {
    return this.makeRequest<GitHubIssue>(`/repos/${owner}/${repo}/issues`, {
      method: 'POST',
      body: JSON.stringify({
        title,
        body: body || '',
      }),
    });
  }

  async closeIssue(
    owner: string,
    repo: string,
    issueNumber: number
  ): Promise<GitHubIssue> {
    return this.makeRequest<GitHubIssue>(`/repos/${owner}/${repo}/issues/${issueNumber}`, {
      method: 'PATCH',
      body: JSON.stringify({
        state: 'closed',
      }),
    });
  }

  async getRateLimit(): Promise<RateLimitInfo> {
    const response = await this.makeRequest<any>('/rate_limit');
    return response.rate;
  }
}
