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

        const payment = await prisma.user_payment.findMany({
            select: {
                id: true,
                amount: true,
                note: true,
                proof_file: true,
                transaction_date: true,
            },
            where: {
                deleted_at: null,
                user_account_id: req.query.id as string
            },
            orderBy: {
                created_at: 'asc'
            }
        })

        if(!payment) api.null(res, payment, 'Payment')

        return api.res(res, 200, true, 'Get payment data success', payment)
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