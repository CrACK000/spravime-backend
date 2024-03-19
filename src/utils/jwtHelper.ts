import jwt from 'jsonwebtoken'

const secret = process.env.SESSION_SECRET

export const generateToken = (id: any) => {
  return jwt.sign({ id }, secret, { expiresIn: 60 * 60 })
}

export const validateToken = (token: any) => {
  return jwt.verify(token, secret)
}