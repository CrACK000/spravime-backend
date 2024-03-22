import passport from 'passport'
import { Strategy as JwtStrategy } from 'passport-jwt'
import { User } from '../models/user'
import { Algorithm } from 'jsonwebtoken'

const publicKey = process.env.PUBLIC_KEY

let opts = {
  jwtFromRequest: (req: any) => {
    return req.get('Authorization')?.replace('Bearer ', '')
  },
  secretOrKey: publicKey,
  algorithms: [process.env.SECRET_ALGORITHM] as Algorithm[]
}

passport.use(new JwtStrategy(opts, async function (jwt_payload, done) {

  try {
    const user = await User.findOne({ _id: jwt_payload.id }).select('-password')

    if (user) {
      return done(null, user)
    } else {
      return done(null, false)
    }
  } catch (err) {
    console.log('Error finding user:', err)
    return done(err, false)
  }
}))

export const authMiddleware = passport.authenticate('jwt', { session: false })