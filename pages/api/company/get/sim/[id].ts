import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import api from "@/lib/api";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  api.method(req, res, "GET");

  try {
    if (!req.query.id) return api.res(res, 404, false, `ID is required`);

    const file = await prisma.company.findUnique({
      select: {
        sim_file: true,
      },
      where: {
        id: req.query.id as string,
        deleted_at: null,
      },
    });

    if (!file) api.null(res, file, "File");
    else return api.res(res, 200, true, "Get file success", file);
  } catch (error: any) {
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
