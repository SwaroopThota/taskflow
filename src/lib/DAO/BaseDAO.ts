import { PrismaClient } from '@prisma/client'
import {
	BaseObjectType,
	ChangeTypeSchema,
	IDListType,
	IDType,
} from '../util/types'
import { z } from 'zod'
import PrismaClientHelper from '../util/PrismaClientHelper'

export default abstract class BaseDAO<T extends BaseObjectType> {
	prisma: PrismaClient
	constructor() {
		this.prisma = PrismaClientHelper.getInstance()
	}

	abstract retrieve(ids: IDListType): Promise<T[]>

	abstract insert(obj: T): Promise<IDType>

	abstract update(obj: T): Promise<void>

	abstract delete(obj: T): Promise<void>
}

export const BaseObjectSchema = z.object({
	changeType: ChangeTypeSchema,
})

export type BaseObjectSchemaType = z.infer<typeof BaseObjectSchema>
