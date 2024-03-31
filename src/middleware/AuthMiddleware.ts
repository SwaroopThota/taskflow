import { NextFunction, Request, Response } from 'express'
import JWTHandler from '../auth/JWTHandler'
import { UserSchema } from '../lib/DAO/UserDAO'
import UnAuthenticatedError from '../lib/util/error handling/UnAuthenticatedError'
require('express-async-errors')

export default function authMiddleware(
	req: Request,
	_: Response,
	next: NextFunction
) {
	const jwtToken = getTokenFromRequest(req)
	const jwtHandler = new JWTHandler()
	const parsedData = UserSchema.safeParse(
		jwtHandler.getDataFromToken(jwtToken)
	)
	if (parsedData.success) {
		req.body.userData = parsedData.data
		next()
	} else {
		throw new UnAuthenticatedError()
	}
}

function getTokenFromRequest(req: Request) {
	if (req.headers.authorization)
		return req.headers.authorization.split(' ')[1]
	throw new UnAuthenticatedError()
}
