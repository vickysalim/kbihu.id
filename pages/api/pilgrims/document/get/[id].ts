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
        const { year } = req.body
        if(!req.query.id) return api.res(res, 404, false, `ID is required`)
        if(!year) return api.res(res, 404, false, `User year is required`)

        const document = await prisma.company_document.findMany({
            select: {
                id: true,
                company_id: true,
                name: true,
                company_document_year: {
                    select: {
                        id: true,
                        year: true,
                    },
                    where: {
                        OR: [
                            { year: year as string },
                            { year: 'ALL' as string }
                        ],
                        deleted_at: null
                    }
                },
            },
            where: {
                deleted_at: null,
                company_id: req.query.id as string,
            },
        })

        const filteredDoc = document.filter(doc => 
            doc.company_document_year.length > 0
        )

        return api.res(res, 200, true, 'Get document data success', filteredDoc)
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