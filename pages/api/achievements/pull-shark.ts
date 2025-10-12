import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth, getGitHubToken } from "@/lib/auth-helpers";
import { GitHubAPIClient } from "@/lib/github-api-server";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const token = await getGitHubToken(req, res);

    if (!token) {
      return res.status(401).json({ error: "No GitHub token found" });
    }

    const { repoName, commitMessage, prTitle } = req.body;

    if (!repoName) {
      return res.status(400).json({ error: "Repository name is required" });
    }

    const client = new GitHubAPIClient(token);

    const { data: user } = await client.getUser();
    const username = user.login;

    const { data: repo } = await client.post<{
      name: string;
      html_url: string;
    }>(`/user/repos`, {
      name: repoName,
      description: "Practice repository for workflow automation",
      private: false,
      auto_init: true,
    });

    const { data: defaultBranch } = await client.get<{
      object: { sha: string };
    }>(`/repos/${username}/${repoName}/git/ref/heads/main`);
    const mainSha = defaultBranch.object.sha;

    const branchName = `feature/update-${Date.now()}`;
    await client.post(`/repos/${username}/${repoName}/git/refs`, {
      ref: `refs/heads/${branchName}`,
      sha: mainSha,
    });

    const fileContent = `# ${repoName}\n\nUpdated at ${new Date().toISOString()}`;
    await client.put(`/repos/${username}/${repoName}/contents/README.md`, {
      message: commitMessage || "Update README",
      content: Buffer.from(fileContent).toString("base64"),
      branch: branchName,
    });

    const { data: pr } = await client.post<{
      number: number;
      html_url: string;
    }>(`/repos/${username}/${repoName}/pulls`, {
      title: prTitle || "Update README",
      head: branchName,
      base: "main",
      body: "Automated pull request for achievement progress",
    });

    await client.put(`/repos/${username}/${repoName}/pulls/${pr.number}/merge`, {
      commit_title: prTitle || "Update README",
      merge_method: "merge",
    });

    return res.status(200).json({
      success: true,
      repository: repo.html_url,
      pullRequest: pr.html_url,
      message: "Pull request created and merged successfully",
    });
  } catch (error) {
    console.error("Pull Shark Automation Error:", error);
    return res.status(500).json({
      error: "Failed to automate Pull Shark achievement",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export default requireAuth(handler);
