import { NextApiRequest, NextApiResponse } from "next";
import ZimbraAdmin from "../../lib/zimbraAdmin";

const ADMIN_USERNAME = process.env.ZIMBRA_ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ZIMBRA_ADMIN_PASSWORD;
const ADMIN_SOAP_URL = process.env.ZIMBRA_ADMIN_SOAP_URL;
const EMAIL_HOST = process.env.ZIMBRA_EMAIL_HOST;

let zimbraAdmin: ZimbraAdmin;

async function init() {
  if (ADMIN_USERNAME && ADMIN_PASSWORD && ADMIN_SOAP_URL && EMAIL_HOST) {
    zimbraAdmin = new ZimbraAdmin(ADMIN_SOAP_URL);
    await zimbraAdmin.auth(ADMIN_USERNAME, ADMIN_PASSWORD);
  } else {
    throw new Error("Missing Zimbra configuration.");
  }
}

async function handler({ body }: NextApiRequest, res: NextApiResponse) {
  if (!zimbraAdmin) {
    await init();
  }

  const data = JSON.parse(body);

  const username = data.username;
  const password = data.password;
  const firstName = data.firstName;
  const lastName = data.lastName;
  const email = `${username}@${EMAIL_HOST}`;
  const displayName = `${firstName} ${lastName}`;

  try {
    await zimbraAdmin.createAccount(
      email,
      password,
      firstName,
      lastName,
      displayName
    );

    res.status(200).json({ account: { ...data, email, displayName } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export default handler;
