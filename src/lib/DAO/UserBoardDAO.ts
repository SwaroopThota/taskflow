import { z } from 'zod'
import { IDListType, UserBoardType } from '../util/types'
import { DEFAULT_UUID } from '../util/constants'
import BaseDAO, { BaseObjectSchema } from './BaseDAO'
require('express-async-errors')

export default class UserBoardDAO extends BaseDAO<UserBoardType> {
	constructor() {
		super()
	}

	async retrieve(ids: IDListType) {
		// throw new CustomError(
		// 	'This operation is not supported',
		// 	HTTP_STATUS_CODES.BAD_REQUEST
		// )
		return []
	}

	async insert(userBoard: UserBoardType) {
		const { userId, boardId, isOwner } = UserBoardSchema.parse(userBoard)
		await this.prisma.userBoardJoin.create({
			data: {
				boardId,
				userId,
				isOwner,
			},
		})

		return userId + ' ' + boardId
	}

	async update(userBoard: UserBoardType) {
		const { userId, boardId, isOwner } = UserBoardSchema.parse(userBoard)
		await this.prisma.userBoardJoin.update({
			where: {
				userId_boardId: {
					userId,
					boardId,
				},
			},
			data: {
				isOwner,
			},
		})
	}

	async delete(userBoard: UserBoardType) {
		const { userId, boardId } = UserBoardSchema.parse(userBoard)
		await this.prisma.userBoardJoin.delete({
			where: {
				userId_boardId: {
					userId,
					boardId,
				},
			},
		})
	}
}

const UserBoardSchema = z.intersection(
	BaseObjectSchema,
	z.object({
		userId: z.string().uuid().default(DEFAULT_UUID),
		boardId: z.string().uuid().default(DEFAULT_UUID),
		isOwner: z.boolean().default(false),
	})
)

export type UserBoardSchemaType = z.infer<typeof UserBoardSchema>
