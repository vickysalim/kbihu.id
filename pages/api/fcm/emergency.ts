import type { NextApiRequest, NextApiResponse } from "next";
import admin from "@/lib/firebase/admin";
import api from "@/lib/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  api.method(req, res, `POST`);

  try {
    const { channel, lat, long, userName } = req.body;

    if (!channel) return api.res(res, 400, false, `Channel is required`);
    if (!lat) return api.res(res, 400, false, `Latitude is required`);
    if (!long) return api.res(res, 400, false, `Longitude is required`);
    if (!userName) return api.res(res, 400, false, `User Name is required`);

    // const titleMessage = `Peringatan Darurat! Jemaah haji atas nama ${userName} tersesat`;
    // const bodyMessage = `${userName} tersesat di ${lat}, ${long} pada ${new Date().toUTCString}`;

    const messagePayload: admin.messaging.Message = {
      data: {
        // title: titleMessage as string,
        // body: bodyMessage as string,
        lat: lat as string,
        long: long as string,
        name: userName as string,
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
        `Successfully send emergency notification: ${response}`
      );
    } catch (error) {
      return api.error(res, error.message);
    }
  } catch (error) {
    return api.error(res, error.message);
  }
}
