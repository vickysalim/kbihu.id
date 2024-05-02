import * as admin from "firebase-admin";
import serviceAccount from "@/kbihuid-mobile-firebase-adminsdk-wk509-c4b91371a1.json";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export default admin;
