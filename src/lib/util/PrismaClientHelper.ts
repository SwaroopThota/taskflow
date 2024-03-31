import { PrismaClient } from '@prisma/client'

export default class PrismaClientHelper {
	private static _prismaClient: PrismaClient
	public static getInstance() {
		if (!this._prismaClient) this._prismaClient = new PrismaClient()
		return this._prismaClient
	}
}
