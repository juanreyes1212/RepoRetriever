import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth-config";
import type { NextApiRequest, NextApiResponse } from "next";

export async function getServerSideSession(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return await getServerSession(req, res, authOptions);
}

export async function getGitHubToken(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<string | null> {
  const session = await getServerSideSession(req, res);
  return session?.accessToken || null;
}

export function requireAuth(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSideSession(req, res);

    if (!session || !session.accessToken) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "You must be signed in to access this resource",
      });
    }

    return handler(req, res);
  };
}
