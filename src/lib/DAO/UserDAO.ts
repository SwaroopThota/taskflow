import { z } from 'zod'
import {
	EmailSchema,
	IDListSchema,
	IDListType,
	IDSchema,
	NameSchema,
	PasswordSchema,
	UserType,
	UserWithPasswordType,
} from '../util/types'
import BaseDAO, { BaseObjectSchema } from './BaseDAO'
import { USER_ROLE } from '@prisma/client'
require('express-async-errors')

export default class UserDAO extends BaseDAO<UserType | UserWithPasswordType> {
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

		let data = await this.prisma.user.findMany({
			where,
			select: {
				id: true,
				email: true,
				name: true,
				role: true,
				userProfileUrl: true,
				githubAccessToken: true,
				UserBoardJoin: {
					select: {
						board: {
							select: {
								id: true,
								name: true,
							},
						},
					},
				},
			},
		})

		const returnData: UserType[] = data.map((user) => {
			let { UserBoardJoin, ...rest } = user
			let boards = UserBoardJoin.map((joinObj) => joinObj.board)
			return {
				...rest,
				boards,
			}
		})

		return returnData
	}
	async retriveByEmail(userEmail: string) {
		const { email } = UserSchema.parse({
			email: userEmail,
		})

		let data = await this.prisma.user.findUnique({
			where: {
				email,
			},
		})

		if (!data) return null

		return data.id
	}

	// TODO: return jwt
	async retriveByEmailAndPassword(userEmail: string, userPassword: string) {
		const { email, password } = UserWithPasswordSchema.parse({
			email: userEmail,
			password: userPassword,
		})

		let data = await this.prisma.user.findUnique({
			where: {
				email_password: {
					email,
					password,
				},
			},
		})

		if (!data) return null

		return data.id
	}

	async insert(obj: UserWithPasswordType) {
		const { name, email, password, userProfileUrl, githubAccessToken } =
			UserWithPasswordSchema.parse(obj)
		const { id } = await this.prisma.user.create({
			data: {
				name,
				email,
				password,
				userProfileUrl,
				githubAccessToken,
			},
		})
		return id
	}

	async update(user: UserType) {
		const { id, name, email, userProfileUrl, githubAccessToken } =
			UserSchema.parse(user)
		await this.prisma.user.update({
			where: { id },
			data: {
				name,
				email,
				userProfileUrl,
				githubAccessToken,
			},
		})
	}

	async delete(user: UserType) {
		const { id } = UserSchema.parse(user)
		await this.prisma.user.delete({
			where: { id },
		})
	}
}

export const UserSchema = z.intersection(
	BaseObjectSchema,
	z.object({
		id: IDSchema,
		email: EmailSchema,
		name: NameSchema,
		userProfileUrl: z.string().url().optional().nullable(),
		githubAccessToken: z.string().optional().nullable(),
		role: z.custom<USER_ROLE>().default(USER_ROLE.NORMAL_USER),
	})
)

export const UsersSchema = z.array(UserSchema)

export type UserSchemaType = z.infer<typeof UserSchema>

const UserWithPasswordSchema = z.intersection(
	UserSchema,
	z.object({
		password: PasswordSchema,
	})
)

export type UserWithPasswordSchemaType = z.infer<typeof UserWithPasswordSchema>
