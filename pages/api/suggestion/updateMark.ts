import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import api from "@/lib/api";
import prisma from "@/lib/prisma";

const validation = z.object({
  id: z.string().min(1, { message: `ID is required` }),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  api.method(req, res, `PUT`);

  try {
    const reqBody = validation.parse(req.body);

    await prisma.suggestion_box
      .update({
        where: {
          id: reqBody.id,
        },
        data: {
          is_mark: true,
          updated_at: new Date(),
        },
      })
      .catch((err) => {
        return api.res(res, 404, false, `Suggestion not found`);
      });

    return api.res(res, 200, true, `Suggestion mark as read`);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validation = error.errors.map((error) => ({
        field: error.path[0],
        message: error.message,
      }));

      return api.invalid(res, validation);
    } else {
      return api.error(res, error.message);
    }
  }
}
