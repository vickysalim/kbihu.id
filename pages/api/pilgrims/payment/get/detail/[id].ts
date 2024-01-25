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

        const payment = await prisma.user_payment.findUnique({
            select: {
                company_id: true,
                user_account_id: true,
                amount: true,
                note: true,
                proof_file: true,
                transaction_date: true,
            },
            where: {
                deleted_at: null,
                id: req.query.id as string
            },
        })

        if(!payment) return api.null(res, payment, 'Payment')

        const company = await prisma.company.findUnique({
            select: {
                name: true,
                street: true,
                district: true,
                subdistrict: true,
                city: true,
                province: true,
                postal_code: true,
                company_logo: true,
            },
            where: {
                deleted_at: null,
                id: payment?.company_id
            }
        })

        if(!company) return api.null(res, company, 'Payment')

        const pilgrim = await prisma.user_account.findUnique({
            select: {
                phone_number: true,
                user_profile: {
                    select: {
                        portion_number: true,
                        name: true,
                        nasab_name: true,
                    },
                },
            },
            where: {
                deleted_at: null,
                role: 'User',
                id: payment?.user_account_id
            },
        })

        if(!pilgrim) api.null(res, pilgrim, 'Payment')
        
        const data = {
            company_name: company?.name,
            company_street: company?.street,
            company_district: company?.district,
            company_subdistrict: company?.subdistrict,
            company_city: company?.city,
            company_province: company?.province,
            company_postal_code: company?.postal_code,
            company_logo: company?.company_logo,
            phone_number: pilgrim?.phone_number,
            portion_number: pilgrim?.user_profile[0].portion_number,
            name: pilgrim?.user_profile[0].name,
            nasab_name: pilgrim?.user_profile[0].nasab_name,
            amount: payment?.amount,
            note: payment?.note,
            proof_file: payment?.proof_file,
            transaction_date: payment?.transaction_date,            
        }

        return api.res(res, 200, true, 'Get data success', data)
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