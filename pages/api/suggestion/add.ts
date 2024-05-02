import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import api from "@/lib/api";
import { v4 as uuidv4 } from "uuid";
import prisma from "@/lib/prisma";

const validation = z.object({
  user_account_id: z.string().min(1, { message: `Akun wajib dimasukkan` }),
  company_id: z.string().min(1, { message: `KBIHU wajib dimasukkan` }),
  description: z.string().min(1, { message: `Deskripsi wajib dimasukkan` }),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  api.method(req, res, `POST`);

  try {
    const reqBody = validation.parse(req.body);

    const suggestion = await prisma.suggestion_box.create({
      data: {
        id: uuidv4(),
        user_account_id: reqBody.user_account_id,
        company_id: reqBody.company_id,
        description: reqBody.description,
      },
    });

    return api.res(res, 200, true, `Successfully add new suggestion`, {
      suggestion,
    });
  } catch (error) {
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
