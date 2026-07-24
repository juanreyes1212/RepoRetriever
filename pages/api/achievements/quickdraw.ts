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

    const { repoName, autoDelete } = req.body;

    if (!repoName) {
      return res.status(400).json({ error: "Repository name is required" });
    }

    const client = new GitHubAPIClient(token);

    const { data: user } = await client.getUser();
    const username = user.login;

    await client.post(`/user/repos`, {
      name: repoName,
      description: "Practice repository for workflow automation",
      private: false,
      auto_init: true,
    });

    const { data: issue } = await client.post<{
      number: number;
      html_url: string;
    }>(`/repos/${username}/${repoName}/issues`, {
      title: "Automated issue for Quickdraw achievement",
      body: "This issue was created and will be closed rapidly to demonstrate the Quickdraw achievement pattern.",
    });

    await client.patch(`/repos/${username}/${repoName}/issues/${issue.number}`, {
      state: "closed",
    });

    let deletedRepo = false;
    if (autoDelete) {
      try {
        await client.delete(`/repos/${username}/${repoName}`);
        deletedRepo = true;
      } catch (deleteError) {
        console.error("Failed to delete repository:", deleteError);
      }
    }

    return res.status(200).json({
      success: true,
      repository: `https://github.com/${username}/${repoName}`,
      issue: issue.html_url,
      deleted: deletedRepo,
      message: deletedRepo
        ? "Issue created, closed, and repository deleted successfully"
        : "Issue created and closed successfully",
    });
  } catch (error) {
    console.error("Quickdraw Automation Error:", error);
    return res.status(500).json({
      error: "Failed to automate Quickdraw achievement",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export default requireAuth(handler);
