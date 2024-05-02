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

    const user = await prisma.user_account.findFirst({
      select: {
        id: true,
        company_id: true,
        user_profile: {
          select: {
            departure_year: true,
          },
        },
      },
      where: {
        id: req.query.id as string,
        deleted_at: null,
      },
    });

    if (user) {
      const user_id = user?.id;
      const company_id = user?.company_id;
      const user_year = user?.user_profile[0].departure_year.toString();

      const document = await prisma.company_document.findMany({
        select: {
          id: true,
          company_id: true,
          name: true,
          company_document_year: {
            select: {
              id: true,
              year: true,
            },
            where: {
              OR: [{ year: user_year as string }, { year: "ALL" as string }],
              deleted_at: null,
            },
          },
          user_document: {
            select: {
              id: true,
              file: true,
              description: true,
              submit_date: true,
            },
            where: {
              user_account_id: user_id as string,
              deleted_at: null,
            },
          },
        },
        where: {
          deleted_at: null,
          company_id: company_id as string,
        },
      });

      const filteredDoc = document.filter(
        (doc) => doc.company_document_year.length > 0
      );

      return api.res(res, 200, true, "Get document data success", filteredDoc);
    } else {
      return api.res(res, 404, false, "User not found");
    }
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