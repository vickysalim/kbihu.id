import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import api from '@/lib/api'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    api.method(req, res, 'GET')

    try {
        const company = await prisma.company.count({
            where: {
                deleted_at: null
            }
        })

        const user = await prisma.user_account.count({
            where: {
                role: 'User',
                company_id: { not: null },
                deleted_at: null
            }
        })

        return api.res(res, 200, true, 'Get company and user count success', { company, user })

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