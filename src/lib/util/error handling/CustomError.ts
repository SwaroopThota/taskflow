import { ERROR_STATUS_CODES_TYPE, HTTP_STATUS_CODES } from '../types'

export default class CustomError extends Error {
	public status: ERROR_STATUS_CODES_TYPE
	public name: string
	constructor(
		message: string = 'Internal Server Error',
		status: ERROR_STATUS_CODES_TYPE = HTTP_STATUS_CODES.SERVER_ERROR,
		name: string = 'Error'
	) {
		super(message)
		this.name = name
		this.status = status
	}
}
