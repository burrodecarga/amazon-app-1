import nc from "next-connect"
import User from "../../../models/User"
import db from "../../../utils/db"
import bcrypt from "bcryptjs"
import { signToken } from "../../../utils/auth"

const handler = nc()
handler.post(async (req, res) => {
  await db.connect()
  const user = await User.findOne({ email: req.body.email })
  await db.disconnect()
  if (user && bcrypt.compareSync(req.body.password,user.password)) {
    const token = signToken(user)
    console.log('XXXXXXXXXXXXXXXXXXXXXXXXX'+token+'   user'+user+'  secreto'+process.env.JWT_SECRET)
    res.send({
      token,
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    })
  }else{
    res.status(401).send({ message:'invalid user or password'})
  }
})

export default handler