import CustomError from './CustomError'
import { HTTP_STATUS_CODES } from '../types'

export default class UnAuthenticatedError extends CustomError {
	constructor() {
		super(
			'User is not authenticated.',
			HTTP_STATUS_CODES.FORBIDDEN,
			'Unauthenticated Access Error'
		)
	}
}
