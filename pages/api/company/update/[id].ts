import type { NextApiRequest, NextApiResponse } from 'next'
import api from '@/lib/api'
import prisma from '@/lib/prisma'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    api.method(req, res, `PUT`)

    try {
        const { name, street, district, subdistrict, city, province, postal_code, phone_number, leader, license } = req.body

        if(!req.query.id) return api.res(res, 404, false, `ID is required`)

        const data = await prisma.company.findUnique({
            where: {
                id: req.query.id as string
            }
        })

        if(!data) return api.null(res, data, `Company`)

        if(data.deleted_at) return api.null(res, data, `Company`)

        if(postal_code && isNaN(postal_code))
            return api.res(res, 404, false, `Postal code must be a number`)

        await prisma.company.update({
            where: {
                id: req.query.id as string
            },
            data: {
                name: name || data.name,
                street: street || data.street,
                district: district || data.district,
                subdistrict: subdistrict || data.subdistrict,
                city: city || data.city,
                province: province || data.province,
                postal_code: parseInt(postal_code) || data.postal_code,
                phone_number: phone_number || data.phone_number,
                leader: leader || data.leader,
                license: license || data.license,
                updated_at: new Date()
            }
        }).catch((err) => {
            return api.res(res, 404, false, `Failed to update data`)
        })

        return api.res(res, 200, true, `Company updated`)
    } catch (error) {
        return api.error(res, error.message)
    }
}