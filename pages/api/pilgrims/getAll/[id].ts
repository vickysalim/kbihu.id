import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import api from '@/lib/api'
import prisma from '@/lib/prisma'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    api.method(req, res, 'GET')

    try {
        if(!req.query.id) return api.res(res, 404, false, `ID is required`)

        const pilgrim = await prisma.user_account.findMany({
            select: {
                id: true,
                username: true,
                phone_number: true,
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
                    },
                },
            },
            where: {
                deleted_at: null,
                role: 'User',
                company_id: req.query.id as string
            },
        })

        if(!pilgrim) api.null(res, pilgrim, 'Pilgrim')

        const data = pilgrim.map((item) => ({
            id: item.id,
            username: item.username,
            phone_number: item.phone_number,
            user_profile: {
                id: item.user_profile[0].id,
                departure_year: item.user_profile[0].departure_year,
                reg_number: item.user_profile[0].reg_number,
                portion_number: item.user_profile[0].portion_number,
                bank: item.user_profile[0].bank,
                bank_branch: item.user_profile[0].bank_branch,
                name: item.user_profile[0].name,
                nasab_name: item.user_profile[0].nasab_name,
                gender: item.user_profile[0].gender,
                marital_status: item.user_profile[0].marital_status,
                blood_type: item.user_profile[0].blood_type,
                pob: item.user_profile[0].pob,
                dob: item.user_profile[0].dob,
                street: item.user_profile[0].street,
                postal_code: item.user_profile[0].postal_code,
                subdistrict: item.user_profile[0].subdistrict,
                district: item.user_profile[0].district,
                city: item.user_profile[0].city,
                province: item.user_profile[0].province,
                education: item.user_profile[0].education,
                job: item.user_profile[0].job,
                passport_number: item.user_profile[0].passport_number,
                passport_name: item.user_profile[0].passport_name,
                passport_pob: item.user_profile[0].passport_pob,
                passport_dob: item.user_profile[0].passport_dob,
                passport_issue_date: item.user_profile[0].passport_issue_date,
                passport_expiry_date: item.user_profile[0].passport_expiry_date,
                passport_issue_office: item.user_profile[0].passport_issue_office,
                passport_endorsement: item.user_profile[0].passport_endorsement,
                identity_number: item.user_profile[0].identity_number,
            }

            
        }))

        return api.res(res, 200, true, 'Get pilgrims data success', data)

    } catch (error: any) {
        if(error instanceof z.ZodError) {
            const validation = error.errors.map((error) => ({
                field: error.path[0],
                message: error.message
            }))

            return api.invalid(res, validation)
        } else {
            return api.error(res, error.message)
        }
    }
}