import type { NextApiRequest, NextApiResponse } from "next";
import api from "@/lib/api";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  api.method(req, res, `PUT`);

  try {
    const { description, submitDate } = req.body;

    if (!req.query.id) return api.res(res, 404, false, `ID is required`);

    const data = await prisma.user_facility.findUnique({
      where: {
        id: req.query.id as string,
      },
    });

    if (!data) return api.null(res, data, `Facility`);

    if (data.deleted_at) return api.null(res, data, `Facility`);

    await prisma.user_facility
      .update({
        where: {
          id: req.query.id as string,
        },
        data: {
          description: description,
          submit_date: new Date(submitDate) || data.submit_date,
          updated_at: new Date(),
        },
      })
      .catch((err) => {
        return api.res(res, 404, false, `Failed to update data`);
      });

    return api.res(res, 200, true, `Facility updated`);
  } catch (error) {
    return api.error(res, error.message);
  }
}
