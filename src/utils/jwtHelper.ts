import jwt, { Algorithm } from 'jsonwebtoken'

const privateKey = process.env.PRIVATE_KEY
const publicKey = process.env.PUBLIC_KEY
const algorithm = (process.env.SECRET_ALGORITHM as unknown) as Algorithm

export const generateToken = (id: any) => {
  return jwt.sign({ id }, privateKey, { expiresIn: '30d', algorithm: algorithm })
}

export const validateToken = (token: any) => {
  return jwt.verify(token, publicKey, { algorithms: [algorithm] })
}