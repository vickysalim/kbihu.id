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
        const company = await prisma.company.findMany({
            select: {
                id: true,
                name: true,
                street: true,
                district: true,
                subdistrict: true,
                city: true,
                province: true,
                postal_code: true,
                company_logo: true,
                phone_number: true,
                leader: true,
                license: true,
            },
            where: {
                deleted_at: null
            },
            orderBy: {
                created_at: 'asc'
            }
        })

        return api.res(res, 200, true, 'Get company data success', { company })

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