import type { NextApiRequest, NextApiResponse } from "next";
import api from "@/lib/api";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  api.method(req, res, `PUT`);

  try {
    const { title, description } = req.body;

    if (!req.query.id) return api.res(res, 404, false, `ID is required`);

    const data = await prisma.information.findUnique({
      where: {
        id: req.query.id as string,
      },
    });

    if (!data) return api.null(res, data, `Information`);

    if (data.deleted_at) return api.null(res, data, `Information`);

    await prisma.information
      .update({
        where: {
          id: req.query.id as string,
        },
        data: {
          title: title || data.title,
          description: description || data.description,
          updated_at: new Date(),
        },
      })
      .catch((err) => {
        return api.res(res, 404, false, `Failed to update data`);
      });

    return api.res(res, 200, true, `Information updated`);
  } catch (error) {
    return api.error(res, error.message);
  }
}
