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
    const { company_id, title, description } = req.body;

    if (!company_id) return api.res(res, 400, false, `Company is required`);
    if (!title) return api.res(res, 400, false, `Title is required`);
    if (!description)
      return api.res(res, 400, false, `Description is required`);

    const information = await prisma.information.create({
      data: {
        id: uuidv4(),
        company_id: company_id,
        title: title,
        description: description,
      },
    });

    return api.res(res, 200, true, `Successfully add new information data`);
  } catch (error) {
    return api.error(res, error.message);
  }
}
