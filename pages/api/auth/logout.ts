import { NextApiRequest, NextApiResponse } from 'next'
import { deleteCookie } from 'cookies-next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        deleteCookie('token', { req, res });
        deleteCookie('csrf-token', { req, res });
    }
}