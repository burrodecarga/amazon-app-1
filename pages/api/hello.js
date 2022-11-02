// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import db from "../../utils/db"

export default async function handler(req, res) {
  await db.connect()
  await db.disconnect()
  res.statusCode = 200
  res.json({ name: "John Doe" })
}
