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

    const facility = await prisma.company_facility.findMany({
      select: {
        id: true,
        name: true,
        company_facility_year: {
          select: {
            id: true,
            year: true,
          },
          orderBy: {
            year: "asc",
          },
        },
      },
      where: {
        deleted_at: null,
        company_id: req.query.id as string,
      },
    });

    if (!facility) api.null(res, facility, "Facility");

    return api.res(res, 200, true, "Get facility data success", facility);
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