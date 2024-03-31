import { z } from 'zod'
import {
	BoardType,
	IDListSchema,
	IDListType,
	IDSchema,
	NameSchema,
} from '../util/types'
import BaseDAO, { BaseObjectSchema } from './BaseDAO'
require('express-async-errors')

export default class BoardDAO extends BaseDAO<BoardType> {
	constructor() {
		super()
	}

	async retrieve(ids: IDListType) {
		ids = IDListSchema.parse(ids)
		let where = ids.length
			? {
					id: { in: ids },
			  }
			: {}
		let data = await this.prisma.board.findMany({
			where,
			select: {
				id: true,
				name: true,
				UserBoardJoin: {
					select: {
						isOwner: true,
						user: {
							select: {
								id: true,
								name: true,
								userProfileUrl: true,
							},
						},
					},
				},
				panels: {
					select: {
						id: true,
						name: true,
						tasks: {
							select: {
								id: true,
								title: true,
								description: true,
								sortOrder: true,
								priority: true,
								author: {
									select: {
										id: true,
										name: true,
										userProfileUrl: true,
									},
								},
								assignedTo: {
									select: {
										id: true,
										name: true,
										userProfileUrl: true,
									},
								},
							},
						},
					},
				},
			},
		})

		let returnData: BoardType[] = data.map((board) => {
			let { UserBoardJoin, ...rest } = board
			return {
				...rest,
				members: UserBoardJoin.filter(
					(joinObj) => !joinObj.isOwner
				).map((obj) => obj.user),
				owner: UserBoardJoin.filter((joinObj) => joinObj.isOwner).map(
					(obj) => obj.user
				)[0],
			}
		})

		return returnData
	}

	async insert(board: BoardType) {
		const { name } = BoardSchema.parse(board)
		const { id } = await this.prisma.board.create({
			data: {
				name,
			},
		})
		return id
	}

	async update(board: BoardType) {
		const { id, name } = BoardSchema.parse(board)
		await this.prisma.board.update({
			where: { id },
			data: {
				name,
			},
		})
	}

	async delete(board: BoardType) {
		const { id } = BoardSchema.parse(board)
		await this.prisma.board.delete({
			where: { id },
		})
	}
}

const BoardSchema = z.intersection(
	BaseObjectSchema,
	z.object({
		id: IDSchema,
		name: NameSchema,
	})
)

export type BoardSchemaType = z.infer<typeof BoardSchema>
