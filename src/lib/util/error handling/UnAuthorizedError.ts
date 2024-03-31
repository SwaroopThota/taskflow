import CustomError from './CustomError'
import { HTTP_STATUS_CODES } from '../types'

export default class UnAuthorizedError extends CustomError {
	constructor() {
		super(
			'User is not Authorized to perform the following operation.',
			HTTP_STATUS_CODES.UNAUTHORIZED,
			'Unauthorized Access Error'
		)
	}
}
