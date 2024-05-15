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

    const company = await prisma.company_gallery.findMany({
      select: {
        photo: true,
      },
      where: {
        company_id: req.query.id as string,
        deleted_at: null,
      },
    });

    if (!company) api.null(res, company, "Gallery");
    else return api.res(res, 200, true, "Get gallery data success", company);
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
