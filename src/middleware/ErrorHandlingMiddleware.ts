import CustomError from '../lib/util/error handling/CustomError'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { NextFunction, Request, Response } from 'express'
import { HTTP_STATUS_CODES } from '../lib/util/types'

const handlePrismaError = (err: PrismaClientKnownRequestError) => {
	switch (err.code) {
		case 'P2002':
			// handling duplicate key errors
			return new CustomError(
				`Duplicate field value: ${err.meta?.target}`,
				HTTP_STATUS_CODES.BAD_REQUEST,
				'PrismaError'
			)
		case 'P2014':
			// handling invalid id errors
			return new CustomError(
				`Invalid ID: ${err.meta?.target}`,
				HTTP_STATUS_CODES.BAD_REQUEST,
				'PrismaError'
			)
		case 'P2003':
			// handling invalid data errors
			return new CustomError(
				`Invalid input data: ${err.meta?.target}`,
				HTTP_STATUS_CODES.BAD_REQUEST,
				'PrismaError'
			)
		default:
			// handling all other errors
			return new CustomError(
				`Something went wrong: ${err.message}`,
				HTTP_STATUS_CODES.SERVER_ERROR,
				'PrismaError'
			)
	}
}

const handleJWTError = () =>
	new CustomError(
		'Invalid token please login again',
		HTTP_STATUS_CODES.BAD_REQUEST,
		'JWTError'
	)

const handleJWTExpiredError = () =>
	new CustomError(
		'Token has expired please login again',
		HTTP_STATUS_CODES.BAD_REQUEST,
		'JWTError'
	)

const sendErrorDev = (err: CustomError, _: Request, res: Response) => {
	res.status(err.status).json({
		status: err.status,
		errors: err,
		message: err.message,
		stack: err.stack,
	})
}

const sendErrorProd = (err: CustomError, _: Request, res: Response) => {
	console.error('ERROR 💥', err)

	return res
		.status(HTTP_STATUS_CODES.BAD_REQUEST)
		.json({ status: ' error', message: 'Please try again later' })
}

export default function errorHandlingMiddleware(
	err: CustomError,
	req: Request,
	res: Response,
	_: NextFunction
) {
	err.status = err.status || 500
	if (process.env.NODE_ENV === 'production') {
		if (err instanceof PrismaClientKnownRequestError) {
			console.log('handlePrismaError')
			err = handlePrismaError(err)
		} else if (err.name === 'JsonWebTokenError') {
			err = handleJWTError()
		} else if (err.name === 'TokenExpiredError') {
			err = handleJWTExpiredError()
		}
		sendErrorProd(err, req, res)
	} else {
		sendErrorDev(err, req, res)
	}
}
