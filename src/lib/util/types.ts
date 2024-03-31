import { z } from 'zod'
import { BoardSchemaType } from '../DAO/BoardDAO'
import { UserBoardSchemaType } from '../DAO/UserBoardDAO'
import { UserSchemaType, UserWithPasswordSchemaType } from '../DAO/UserDAO'
import {
	DEFAULT_EMAIL,
	DEFAULT_NAME,
	DEFAULT_PASSWORD,
	DEFAULT_UUID,
} from './constants'
import { PanelSchemaType } from '../DAO/PanelDAO'
import { BaseObjectSchemaType } from '../DAO/BaseDAO'
import { TaskSchemaType } from '../DAO/TaskDAO'
import CustomError from './error handling/CustomError'

export enum ChangeType {
	NONE = 'NONE',
	INSERT = 'INSERT',
	UPDATE = 'UPDATE',
	DELETE = 'DELETE',
}

export enum HTTP_STATUS_CODES {
	SUCCESS = 200,
	NOT_FOUND = 404,
	SERVER_ERROR = 500,
	RESOURCE_CREATED = 201,
	RESOURCE_UPDATED = 204,
	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,
	FORBIDDEN = 403,
}

export type ERROR_STATUS_CODES_TYPE =
	| HTTP_STATUS_CODES.BAD_REQUEST
	| HTTP_STATUS_CODES.NOT_FOUND
	| HTTP_STATUS_CODES.SERVER_ERROR
	| HTTP_STATUS_CODES.UNAUTHORIZED
	| HTTP_STATUS_CODES.FORBIDDEN

export type InterfaceObject<T> =
	| SuccessInterfaceObject<T>
	| ErrorInterfaceObject
	| SuccessNoContentInterfaceObject

interface SuccessInterfaceObject<T> {
	success: true
	status: HTTP_STATUS_CODES
	data: T
}

interface SuccessNoContentInterfaceObject {
	success: true
	status: HTTP_STATUS_CODES.RESOURCE_UPDATED
}

export interface ErrorInterfaceObject {
	success: false
	status: HTTP_STATUS_CODES
	error: CustomError
}

export const IDSchema = z.string().uuid().default(DEFAULT_UUID)
export type IDType = z.infer<typeof IDSchema>

export const IDListSchema = z.array(IDSchema)
export type IDListType = z.infer<typeof IDListSchema>

export const NameSchema = z
	.string()
	.min(3, 'Board name should be atleast 3 characters long!')
	.default(DEFAULT_NAME)
export type NameType = z.infer<typeof NameSchema>

export const EmailSchema = z.string().email().default(DEFAULT_EMAIL)

export const PasswordSchema = z
	.string()
	.min(6, 'Name should be atlease 6 characters long!')
	.default(DEFAULT_PASSWORD)

export const ChangeTypeSchema = z
	.custom<ChangeType>()
	.default(ChangeType.NONE)
	.optional()

export type BaseObjectType = Partial<BaseObjectSchemaType> & {}

export type UserType = Partial<UserSchemaType> & {
	boards?: BoardType[]
}

export type UserWithPasswordType = Partial<UserWithPasswordSchemaType> & {
	boards?: BoardType[]
}

export type BoardType = Partial<BoardSchemaType> & {
	owner?: UserType
	members?: UserType[]
	panels?: PanelType[]
}

export type TaskType = Partial<TaskSchemaType> & {}

export type UserBoardType = Partial<UserBoardSchemaType> & {}

export type PanelType = Partial<PanelSchemaType> & {}
