import {
	HTTP_STATUS_CODES,
	IDType,
	InterfaceObject,
	UserType,
	UserWithPasswordType,
} from '../util/types'
import UserDAO from '../DAO/UserDAO'
import BaseFacade from './BaseFacade'
import CustomError from '../util/error handling/CustomError'
require('express-async-errors')

export default class UserFacade extends BaseFacade<
	UserType | UserWithPasswordType
> {
	private static _userDAO = new UserDAO()
	private userDAO: UserDAO
	constructor() {
		super(UserFacade._userDAO)
		this.userDAO = UserFacade._userDAO
	}

	async retriveByEmailAndPassword(email: string, password: string) {
		const data = await this.userDAO.retriveByEmailAndPassword(
			email,
			password
		)
		if (!data)
			throw new CustomError(
				'User Not Found.',
				HTTP_STATUS_CODES.NOT_FOUND
			)
		const returnIO: InterfaceObject<IDType> = {
			success: true,
			status: HTTP_STATUS_CODES.SUCCESS,
			data,
		}
		return returnIO
	}

	async retriveByEmail(email: string) {
		const data = await this.userDAO.retriveByEmail(email)
		if (!data)
			throw new CustomError(
				'User Not Found.',
				HTTP_STATUS_CODES.NOT_FOUND
			)
		const returnIO: InterfaceObject<IDType> = {
			success: true,
			status: HTTP_STATUS_CODES.SUCCESS,
			data,
		}
		return returnIO
	}
}
