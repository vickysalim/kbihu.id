import type { NextApiRequest, NextApiResponse } from "next";
import api from "@/lib/api";
import { v4 as uuidv4 } from "uuid";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  api.method(req, res, `POST`);

  try {
    const { users, year } = req.body;

    if (!year) return api.res(res, 400, false, `Company is required`);
    if (users === undefined)
      return api.res(res, 400, false, `User is required`);

    await prisma.user_profile.updateMany({
      where: {
        user_account_id: {
          in: users,
        },
      },
      data: {
        departure_year: parseInt(year),
      },
    });

    return api.res(res, 200, true, `Successfully bulk change departure year`);
  } catch (error) {
    return api.error(res, error.message);
  }
}
