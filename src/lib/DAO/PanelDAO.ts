import {
	IDListSchema,
	IDListType,
	IDSchema,
	NameSchema,
	PanelType,
} from '../util/types'
import { z } from 'zod'
import BaseDAO, { BaseObjectSchema } from './BaseDAO'
require('express-async-errors')

export default class PanelDAO extends BaseDAO<PanelType> {
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
		let data = await this.prisma.panel.findMany({
			where,
			select: {
				id: true,
				name: true,
				boardId: true,
				sortOrder: true,
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
		})
		return data
	}
	async insert(obj: PanelType) {
		const { name, boardId, sortOrder } = PanelSchema.parse(obj)
		const { id } = await this.prisma.panel.create({
			data: {
				name,
				boardId,
				sortOrder,
			},
		})
		return id
	}

	async update(obj: PanelType) {
		const { id, name, boardId, sortOrder } = PanelSchema.parse(obj)
		await this.prisma.panel.update({
			where: { id },
			data: {
				name,
				boardId,
				sortOrder,
			},
		})
	}

	async delete(obj: PanelType) {
		const { id } = PanelSchema.parse(obj)
		await this.prisma.panel.delete({
			where: { id },
		})
	}
}

const PanelSchema = z.intersection(
	BaseObjectSchema,
	z.object({
		id: IDSchema,
		name: NameSchema,
		boardId: IDSchema,
		sortOrder: z.number().optional(),
	})
)

export type PanelSchemaType = z.infer<typeof PanelSchema>
