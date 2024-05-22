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

    const pilgrim = await prisma.user_account.findUnique({
      select: {
        id: true,
        username: true,
        phone_number: true,
        company_id: true,
        user_profile: {
          select: {
            id: true,
            departure_year: true,
            reg_number: true,
            portion_number: true,
            bank: true,
            bank_branch: true,
            name: true,
            nasab_name: true,
            gender: true,
            marital_status: true,
            blood_type: true,
            pob: true,
            dob: true,
            street: true,
            postal_code: true,
            subdistrict: true,
            district: true,
            city: true,
            province: true,
            education: true,
            job: true,
            passport_number: true,
            passport_name: true,
            passport_pob: true,
            passport_dob: true,
            passport_issue_date: true,
            passport_expiry_date: true,
            passport_issue_office: true,
            passport_endorsement: true,
            identity_number: true,
            departure_group: true,
            embarkation: true,
          },
        },
      },
      where: {
        deleted_at: null,
        role: "User",
        id: req.query.id as string,
      },
    });

    if (!pilgrim) api.null(res, pilgrim, "Pilgrim");

    if (pilgrim) {
      const data = {
        id: pilgrim.id,
        username: pilgrim.username,
        phone_number: pilgrim.phone_number,
        company_id: pilgrim.company_id,
        user_profile: {
          id: pilgrim.user_profile[0].id,
          departure_year: pilgrim.user_profile[0].departure_year,
          reg_number: pilgrim.user_profile[0].reg_number,
          portion_number: pilgrim.user_profile[0].portion_number,
          bank: pilgrim.user_profile[0].bank,
          bank_branch: pilgrim.user_profile[0].bank_branch,
          name: pilgrim.user_profile[0].name,
          nasab_name: pilgrim.user_profile[0].nasab_name,
          gender: pilgrim?.user_profile[0].gender,
          marital_status: pilgrim.user_profile[0].marital_status,
          blood_type: pilgrim.user_profile[0].blood_type,
          pob: pilgrim.user_profile[0].pob,
          dob: pilgrim.user_profile[0].dob,
          street: pilgrim.user_profile[0].street,
          postal_code: pilgrim.user_profile[0].postal_code,
          subdistrict: pilgrim.user_profile[0].subdistrict,
          district: pilgrim.user_profile[0].district,
          city: pilgrim.user_profile[0].city,
          province: pilgrim.user_profile[0].province,
          education: pilgrim.user_profile[0].education,
          job: pilgrim.user_profile[0].job,
          passport_number: pilgrim.user_profile[0].passport_number,
          passport_name: pilgrim.user_profile[0].passport_name,
          passport_pob: pilgrim.user_profile[0].passport_pob,
          passport_dob: pilgrim.user_profile[0].passport_dob,
          passport_issue_date: pilgrim.user_profile[0].passport_issue_date,
          passport_expiry_date: pilgrim.user_profile[0].passport_expiry_date,
          passport_issue_office: pilgrim.user_profile[0].passport_issue_office,
          passport_endorsement: pilgrim.user_profile[0].passport_endorsement,
          identity_number: pilgrim.user_profile[0].identity_number,
          departure_group: pilgrim.user_profile[0].departure_group,
          embarkation: pilgrim.user_profile[0].embarkation,
        },
      };

      return api.res(res, 200, true, "Get pilgrims data success", data);
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
