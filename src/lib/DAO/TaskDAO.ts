import {
	IDListSchema,
	IDListType,
	IDSchema,
	PanelType,
	TaskType,
} from '../util/types'
import { z } from 'zod'
import BaseDAO, { BaseObjectSchema } from './BaseDAO'
import { TASK_PRIORITY } from '@prisma/client'
import { DEFAULT_STRING } from '../util/constants'
require('express-async-errors')

export default class TaskDAO extends BaseDAO<PanelType> {
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
		let data = await this.prisma.task.findMany({
			where,
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
		})
		return data
	}
	async insert(obj: TaskType) {
		const {
			title,
			description,
			panelId,
			assignedToId,
			authorId,
			priority,
			sortOrder,
		} = TaskSchema.parse(obj)
		const { id } = await this.prisma.task.create({
			data: {
				title,
				description,
				panelId,
				assignedToId,
				authorId,
				priority,
				sortOrder,
			},
		})
		return id
	}

	async update(obj: TaskType) {
		const {
			id,
			title,
			description,
			panelId,
			assignedToId,
			authorId,
			priority,
			sortOrder,
		} = TaskSchema.parse(obj)
		await this.prisma.task.update({
			where: { id },
			data: {
				title,
				description,
				panelId,
				assignedToId,
				authorId,
				priority,
				sortOrder,
			},
		})
	}

	async delete(obj: TaskType) {
		const { id } = TaskSchema.parse(obj)
		await this.prisma.task.delete({
			where: { id },
		})
	}
}

const TaskSchema = z.intersection(
	BaseObjectSchema,
	z.object({
		id: IDSchema,
		title: z
			.string()
			.min(5, 'should be atlease 5 characters long.')
			.default(DEFAULT_STRING),
		description: z
			.string()
			.min(5, 'should be atlease 5 characters long.')
			.default(DEFAULT_STRING),
		priority: z.custom<TASK_PRIORITY>().default(TASK_PRIORITY.LOW),
		panelId: IDSchema,
		assignedToId: IDSchema,
		authorId: IDSchema,
		sortOrder: z.number().optional(),
	})
)

export type TaskSchemaType = z.infer<typeof TaskSchema>
