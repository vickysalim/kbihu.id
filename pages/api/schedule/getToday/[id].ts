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

    const schedule = await prisma.company_simulation_schedule.findMany({
      select: {
        id: true,
        file: true,
        year: true,
      },
      where: {
        year: new Date().getFullYear(),
        company_id: req.query.id as string,
        deleted_at: null,
      },
    });

    return api.res(res, 200, true, "Get schedule data success", schedule[0]);
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
