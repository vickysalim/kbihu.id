import type { NextApiRequest, NextApiResponse } from "next";
import api from "@/lib/api";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { dateToPass } from "@/lib/date/format";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  api.method(req, res, `PUT`);

  try {
    const {
      departure_year,
      reg_number,
      portion_number,
      bank,
      bank_branch,
      name,
      nasab_name,
      gender,
      marital_status,
      blood_type,
      pob,
      dob,
      street,
      postal_code,
      subdistrict,
      district,
      city,
      province,
      education,
      job,
      passport_number,
      passport_name,
      passport_pob,
      passport_dob,
      passport_issue_date,
      passport_expiry_date,
      passport_issue_office,
      passport_endorsement,
      identity_number,
      phone_number,
      departure_group,
      embarkation,
    } = req.body;

    if (!req.query.id) return api.res(res, 404, false, `ID is required`);

    const data = await prisma.user_account.findUnique({
      where: {
        id: req.query.id as string,
        deleted_at: null,
      },
    });

    const profileDataRaw = await prisma.user_profile.findMany({
      where: {
        user_account_id: req.query.id as string,
        deleted_at: null,
      },
    });

    const profileData = profileDataRaw[0];

    if (!data || !profileData) return api.null(res, data, `Jemaah`);

    if (data.deleted_at) return api.null(res, data, `Jemaah`);

    if (
      dateToPass(new Date(dob).toISOString()) !=
      dateToPass(profileData.dob.toISOString())
    ) {
      const dobParsed = dateToPass(new Date(dob).toISOString());
      const newPassword = await bcrypt.hash(dobParsed, 10);

      await prisma.user_account.update({
        where: {
          id: req.query.id as string,
        },
        data: {
          username: portion_number || data.username,
          phone_number: phone_number || data.phone_number,
          password: newPassword,
          updated_at: new Date(),
        },
      });
    } else {
      await prisma.user_account.update({
        where: {
          id: req.query.id as string,
        },
        data: {
          username: portion_number || data.username,
          phone_number: phone_number || data.phone_number,
          updated_at: new Date(),
        },
      });
    }

    await prisma.user_profile
      .update({
        where: {
          id: profileData.id,
          user_account_id: req.query.id as string,
        },
        data: {
          departure_year:
            parseInt(departure_year) || profileData.departure_year,
          reg_number: reg_number || null,
          portion_number: portion_number || profileData.portion_number,
          bank: bank || profileData.bank,
          bank_branch: bank_branch || null,
          name: name || profileData.name,
          nasab_name: nasab_name || profileData.nasab_name,
          gender: gender || profileData.gender,
          marital_status: marital_status || null,
          blood_type: blood_type || null,
          pob: pob || profileData.pob,
          dob: new Date(dob) || profileData.dob,
          street: street || profileData.street,
          postal_code: parseInt(postal_code) || profileData.postal_code,
          subdistrict: subdistrict || profileData.subdistrict,
          district: district || profileData.district,
          city: city || profileData.city,
          province: province || profileData.province,
          education: education || null,
          job: job || null,
          passport_number: passport_number || profileData.passport_number,
          passport_name: passport_name || profileData.passport_name,
          passport_pob: passport_pob || profileData.passport_pob,
          passport_dob: new Date(passport_dob) || profileData.passport_dob,
          passport_issue_date:
            new Date(passport_issue_date) || profileData.passport_issue_date,
          passport_expiry_date:
            new Date(passport_expiry_date) || profileData.passport_expiry_date,
          passport_issue_office:
            passport_issue_office || profileData.passport_issue_office,
          passport_endorsement: passport_endorsement || null,
          identity_number: identity_number || profileData.identity_number,
          departure_group: parseInt(departure_group) || null,
          embarkation: embarkation || null,
          updated_at: new Date(),
        },
      })
      .catch((err) => {
        return api.res(res, 404, false, `Failed to update data: ${err}`);
      });

    return api.res(res, 200, true, `Jemaah updated`);
  } catch (error) {
    return api.error(res, error.message);
  }
}
