import {
	BoardType,
	ChangeType,
	HTTP_STATUS_CODES,
	IDType,
	InterfaceObject,
} from '../util/types'
import BoardDAO from '../DAO/BoardDAO'
import BaseFacade from './BaseFacade'
import UserBoardFacade from './UserBoardFacade'
require('express-async-errors')

export class BoardFacade extends BaseFacade<BoardType> {
	private static _boardDAO = new BoardDAO()
	private boardDAO: BoardDAO
	private userBoardFacade: UserBoardFacade
	constructor() {
		super(BoardFacade._boardDAO)
		this.boardDAO = BoardFacade._boardDAO
		this.userBoardFacade = new UserBoardFacade()
	}

	async insert(board: BoardType) {
		const newBoardID = await this.boardDAO.insert(board)
		await this.userBoardFacade.save({
			userId: board.owner?.id,
			boardId: newBoardID,
			isOwner: true,
			changeType: ChangeType.INSERT,
		})
		board.members?.forEach(
			async ({ id }) =>
				await this.userBoardFacade.save({
					userId: id,
					boardId: newBoardID,
					changeType: ChangeType.INSERT,
				})
		)
		const returnIO: InterfaceObject<IDType> = {
			success: true,
			status: HTTP_STATUS_CODES.RESOURCE_CREATED,
			data: newBoardID,
		}
		return returnIO
	}

	async update(board: BoardType) {
		await this.boardDAO.update(board)
		board.members?.forEach(
			async ({ id, changeType }) =>
				await this.userBoardFacade.save({
					userId: id,
					boardId: board.id,
					changeType: changeType,
				})
		)
		const returnIO: InterfaceObject<void> = {
			success: true,
			status: HTTP_STATUS_CODES.RESOURCE_UPDATED,
		}
		return returnIO
	}
}
