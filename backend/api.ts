import { NextApiRequest, NextApiResponse } from 'next'

const api = {
    res(
        res: NextApiResponse,
        code: number,
        success: boolean,
        message: string,
        data: any = null
    ) {
        let response = {
            success,
            message
        }

        if(data) {
            response.data = data
        }

        res.status(code).json(response)
    },

    method(
        req: NextApiRequest,
        res: NextApiResponse,
        methods: string
    ) {
        if(req.method !== methods) {
            return api.res(res, 405, false, `Method ${req.method} not allowed`)
        }
    },

    error(
        res: NextApiResponse,
        err: string
    ) {
        let message = `Internal Server Error`

        if(process.env.APP_ENV === 'local') {
            message += `: ${err}`
        }

        api.res(res, 500, false, message)
    },

    null(
        res: NextApiResponse,
        data: any,
        field: string | undefined = `Data`
        
    ) {
        if(data == null) {
            return api.res(res, 404, false, `${field} not found`)
        }
    },

    exist(
        res: NextApiResponse,
        data: any,
        field: string | undefined = `Data`
    ) {
        if(data) {
            return api.res(res, 409, false, `${field} already exist`)
        }
    },

    invalid(
        res: NextApiResponse,
        err: any
    ) {
        api.res(res, 400, false, err)
    }
}

export default api