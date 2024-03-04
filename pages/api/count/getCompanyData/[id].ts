import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import api from "@/lib/api";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  api.method(req, res, "GET");

  const id = req.query.id;

  if (!id) return api.res(res, 400, false, "Company is required");

  try {
    const user = await prisma.user_account.count({
      where: {
        role: "User",
        company_id: id as string,
        deleted_at: null,
      },
    });

    const payment = await prisma.user_payment.count({
      where: {
        company_id: id as string,
        deleted_at: null,
      },
    });

    const documentSql =
      (await prisma.$queryRaw`SELECT COUNT(*) FROM user_document JOIN company_document ON user_document.company_document_id = company_document.id WHERE company_document.company_id = ${
        id as string
      } AND user_document.deleted_at IS NULL AND company_document.deleted_at IS NULL;`) as any;

    const document = Number(documentSql[0]["COUNT(*)"]);

    const facilitySql =
      (await prisma.$queryRaw`SELECT COUNT(*) FROM user_facility JOIN company_facility ON user_facility.company_facility_id = company_facility.id WHERE company_facility.company_id = ${
        id as string
      } AND user_facility.deleted_at IS NULL AND company_facility.deleted_at IS NULL;`) as any;

    const facility = Number(facilitySql[0]["COUNT(*)"]);

    return api.res(res, 200, true, "Get company and user count success", {
      user,
      payment,
      document,
      facility,
    });
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
