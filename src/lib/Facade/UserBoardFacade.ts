import { UserBoardType } from '../util/types'
import UserBoardDAO from '../DAO/UserBoardDAO'
import BaseFacade from './BaseFacade'
require('express-async-errors')

export default class UserBoardFacade extends BaseFacade<UserBoardType> {
	private static _userBoardDAO = new UserBoardDAO()
	private userBoardDAO: UserBoardDAO
	constructor() {
		super(UserBoardFacade._userBoardDAO)
		this.userBoardDAO = UserBoardFacade._userBoardDAO
	}
}
