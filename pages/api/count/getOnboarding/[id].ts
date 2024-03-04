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
    const company_logo = await prisma.company.findFirst({
      where: {
        id: id as string,
        deleted_at: null,
      },
      select: {
        company_logo: true,
      },
    });

    const company_photo = await prisma.company_gallery.count({
      where: {
        company_id: id as string,
        deleted_at: null,
      },
    });

    const userCount = await prisma.user_account.count({
      where: {
        role: "User",
        company_id: id as string,
        deleted_at: null,
      },
    });

    const documentCount = await prisma.company_document.count({
      where: {
        company_id: id as string,
        deleted_at: null,
      },
    });

    const facilityCount = await prisma.company_facility.count({
      where: {
        company_id: id as string,
        deleted_at: null,
      },
    });

    const scheduleCount = await prisma.company_simulation_schedule.count({
      where: {
        company_id: id as string,
        deleted_at: null,
      },
    });

    let profile;
    let pilgrim;
    let document;
    let facility;
    let schedule;

    if (company_logo?.company_logo && company_photo > 0) {
      profile = true;
    } else {
      profile = false;
    }

    if (userCount > 0) {
      pilgrim = true;
    } else {
      pilgrim = false;
    }

    if (documentCount > 0) {
      document = true;
    } else {
      document = false;
    }

    if (facilityCount > 0) {
      facility = true;
    } else {
      facility = false;
    }

    if (scheduleCount > 0) {
      schedule = true;
    } else {
      schedule = false;
    }

    return api.res(res, 200, true, "Get data success", {
      profile,
      pilgrim,
      document,
      facility,
      schedule,
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
