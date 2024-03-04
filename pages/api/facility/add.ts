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

    if (!company_id) return api.res(res, 400, false, `Company is required`);
    if (!name) return api.res(res, 400, false, `Name is required`);
    if (all_year === undefined)
      return api.res(res, 400, false, `All year is required`);
    if (years === undefined)
      return api.res(res, 400, false, `Years is required`);

    const facility = await prisma.company_facility.create({
      data: {
        id: uuidv4(),
        company_id: company_id,
        name: name,
      },
    });

    if (all_year === false) {
      await prisma.company_facility_year.createMany({
        data: years.map((year: string) => {
          return {
            id: uuidv4(),
            company_facility_id: facility.id,
            year: year.toString(),
          };
        }),
      });
    } else {
      await prisma.company_facility_year.create({
        data: {
          id: uuidv4(),
          company_facility_id: facility.id,
        },
      });
    }

    return api.res(res, 200, true, `Successfully add new facility data`);
  } catch (error) {
    return api.error(res, error.message);
  }
}
