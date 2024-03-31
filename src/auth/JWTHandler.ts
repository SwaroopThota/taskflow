import { UserType } from '../lib/util/types'
import jwt from 'jsonwebtoken'
require('express-async-errors')

export default class JWTHandler {
	private jwtSecret: string

	constructor() {
		this.jwtSecret = process.env.JWT_SECRET || ''
	}

	getJwtTokenForUser(user: UserType) {
		let { id, name, email, role } = user
		let jwtPayload = {
			id,
			name,
			email,
			role,
		}
		return jwt.sign(jwtPayload, this.jwtSecret)
	}

	getDataFromToken(token: string) {
		return jwt.verify(token, this.jwtSecret)
	}
}
