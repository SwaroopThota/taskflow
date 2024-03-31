import express, { Request, Response } from 'express'
import UserFacade from '../lib/Facade/UserFacade'
import { ChangeType, UserType, UserWithPasswordType } from '../lib/util/types'
import JWTHandler from '../auth/JWTHandler'
import authMiddleware from '../middleware/AuthMiddleware'
import UnAuthorizedError from '../lib/util/error handling/UnAuthorizedError'
import { USER_ROLE } from '@prisma/client'
require('express-async-errors')

const router = express.Router()

const userFacade = new UserFacade()

router
	.get('/all', authMiddleware, async (_req: Request, res: Response) => {
		const io = await userFacade.retrieve([])
		return res.status(io.status).json(io)
	})
	.get('/me', authMiddleware, async (req: Request, res: Response) => {
		const io = await userFacade.retrieveByID(req.body.userData.id)
		return res.status(io.status).json(io)
	})
	.get('/:id', authMiddleware, async (req: Request, res: Response) => {
		const { id } = req.params
		const io = await userFacade.retrieveByID(id)
		return res.status(io.status).json(io)
	})
	.post('/', async (req: Request, res: Response) => {
		const { name, email, password, userProfileUrl } = req.body
		const user: UserWithPasswordType = {
			name,
			email,
			password,
			userProfileUrl,
			changeType: ChangeType.INSERT,
		}
		const io = await userFacade.save(user)
		return res.status(io.status).json(io)
	})
	.put('/:id', authMiddleware, async (req: Request, res: Response) => {
		const { id } = req.params
		if (req.body?.userData?.id !== id) {
			throw new UnAuthorizedError()
		}
		const { name, email, userProfileUrl } = req.body
		const user: UserType = {
			id,
			name,
			email,
			userProfileUrl,
			changeType: ChangeType.UPDATE,
		}
		const io = await userFacade.save(user)
		return res.status(io.status).json(io)
	})
	.delete('/:id', async (req: Request, res: Response) => {
		if (req.body?.userData?.role !== USER_ROLE.ADMIN) {
			throw new UnAuthorizedError()
		}
		const { id } = req.params
		const user: UserType = {
			id,
			changeType: ChangeType.DELETE,
		}
		const io = await userFacade.save(user)
		return res.status(io.status).json(io)
	})
	// TODO: Needs more logic
	.post('/login', async (req: Request, res: Response) => {
		const { email, password } = req.body
		const io = await userFacade.retriveByEmailAndPassword(email, password)
		const userIO = await userFacade.retrieveByID(io.data)
		const jwtHandler = new JWTHandler()
		io.data = jwtHandler.getJwtTokenForUser(userIO.data)
		return res.status(io.status).json(io)
	})

export default router
