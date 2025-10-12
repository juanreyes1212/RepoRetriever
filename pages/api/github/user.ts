import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth, getGitHubToken } from "@/lib/auth-helpers";
import { GitHubAPIClient } from "@/lib/github-api-server";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const token = await getGitHubToken(req, res);

    if (!token) {
      return res.status(401).json({ error: "No GitHub token found" });
    }

    const client = new GitHubAPIClient(token);
    const { data: user, rateLimit } = await client.getUser();

    return res.status(200).json({
      user,
      rateLimit,
    });
  } catch (error) {
    console.error("GitHub API Error:", error);
    return res.status(500).json({
      error: "Failed to fetch user data",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export default requireAuth(handler);
