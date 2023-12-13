import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import jwt, { Secret } from 'jsonwebtoken'
import api from '@/lib/api'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    api.method(req, res, 'POST')

    try {
        const token = req.headers.authorization
        const userData = req.body.userData

        if(!token) {
            return api.invalid(res, 'Token not provided')
        }

        const decode = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET as Secret)

        if(userData == 'true') {
            const data = await prisma.user_account.findUnique({
                select: {
                   id: true,
                   username: true,
                   phone_number: true,
                   role: true,
                   company_id: true 
                }, where: {
                    id: decode.id
                }
            })

            return api.res(res, 200, true, 'Token is valid', data)
        } else return api.res(res, 200, true, 'Token is valid', decode)
    } catch (err) {
        if(err instanceof z.ZodError) {
            const validationError = err.errors.map((err) => ({
                field: err.path[0],
                message: err.message
            }))

            return api.invalid(res, validationError)
        } else {
            return api.error(res, err.message)
        }
    }

}