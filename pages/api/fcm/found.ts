import type { NextApiRequest, NextApiResponse } from "next";
import admin from "@/lib/firebase/admin";
import api from "@/lib/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  api.method(req, res, `POST`);

  try {
    const { channel, userName, description, status } = req.body;

    if (!channel) return api.res(res, 400, false, `Channel is required`);
    if (!userName) return api.res(res, 400, false, `User Name is required`);
    if (!description)
      return api.res(res, 400, false, `Description is required`);
    if (!status) return api.res(res, 400, false, `Status is required`);

    const messagePayload: admin.messaging.Message = {
      data: {
        name: userName as string,
        description: description as string,
        status: status as string,
        // show utc time in epoch unix format
        time: Math.floor(Date.now() / 1000).toString() as string,
      },
      topic: channel as string,
    };

    try {
      const response = await admin.messaging().send(messagePayload);

      return api.res(
        res,
        200,
        true,
        `Successfully send found notification: ${response}`
      );
    } catch (error) {
      return api.error(res, error.message);
    }
  } catch (error) {
    return api.error(res, error.message);
  }
}
