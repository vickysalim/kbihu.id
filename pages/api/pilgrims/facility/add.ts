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
    const { company_id, name, all_year, years } = req.body;

    if (!req.body.facility_id || !req.body.user_id || !req.body.submit_date)
      return api.res(res, 404, false, `All fields required`);

    const facility = await prisma.user_facility.create({
      data: {
        id: uuidv4(),
        company_facility_id: req.body.facility_id as string,
        user_account_id: req.body.user_id as string,
        submit_date: new Date(req.body.submit_date),
        description: (req.body.description as string) || null,
      },
    });

    return api.res(res, 200, true, `Created new facility data`);
  } catch (error) {
    return api.error(res, error.message);
  }
}
