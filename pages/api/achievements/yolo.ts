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

    const { repoName, commitMessage, autoDelete } = req.body;

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

    const fileContent = `# ${repoName}\n\nDirect commit to main at ${new Date().toISOString()}`;
    await client.put(`/repos/${username}/${repoName}/contents/README.md`, {
      message: commitMessage || "Direct commit to main",
      content: Buffer.from(fileContent).toString("base64"),
      branch: "main",
    });

    const secondContent = `## Additional update\n\nPushed at ${new Date().toISOString()}`;
    await client.put(`/repos/${username}/${repoName}/contents/UPDATE.md`, {
      message: "Second direct commit to main",
      content: Buffer.from(secondContent).toString("base64"),
      branch: "main",
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
      repository: repo.html_url,
      deleted: deletedRepo,
      message: deletedRepo
        ? "Direct commits pushed to main and repository deleted successfully"
        : "Direct commits pushed to main successfully",
    });
  } catch (error) {
    console.error("YOLO Automation Error:", error);
    return res.status(500).json({
      error: "Failed to automate YOLO achievement",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export default requireAuth(handler);
