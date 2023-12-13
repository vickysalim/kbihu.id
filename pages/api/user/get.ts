import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import api from '@/lib/api'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const validation = z.object({
    userId: z.string().min(1, { message: 'UserID is required' })
})

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    api.method(req, res, 'GET')

    try {
        const reqBody = validation.parse(req.body)

        const data = await prisma.user_account.findUnique({
            where: {
                id: reqBody.userId
            }
        })

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