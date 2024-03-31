import { BoardType, ChangeType, UserType } from '../lib/util/types'
import { BoardFacade } from '../lib/Facade/BoardFacade'
import express, { Request, Response } from 'express'
import authMiddleware from '../middleware/AuthMiddleware'

const router = express.Router()

router.use(authMiddleware)

const boardFacade = new BoardFacade()

router
	.get('/:id', async (req: Request, res: Response) => {
		const { id } = req.params
		const returnIO = await boardFacade.retrieveByID(id)
		return res.status(returnIO.status).json(returnIO)
	})
	.post('/', async (req: Request, res: Response) => {
		const { name, owner, members } = req.body
		const board: BoardType = {
			name,
			owner,
			members,
			changeType: ChangeType.INSERT,
		}
		const returnIO = await boardFacade.save(board)
		return res.status(returnIO.status).json(returnIO)
	})
	.put('/:id', async (req: Request, res: Response) => {
		const { id } = req.params
		const { name, members } = req.body
		const board: BoardType = {
			id,
			name,
			members: members?.map((member: UserType): UserType => {
				return { id: member.id, changeType: member.changeType }
			}),
			changeType: ChangeType.UPDATE,
		}
		const returnIO = await boardFacade.save(board)
		return res.status(returnIO.status).json(returnIO)
	})
	.delete('/:id', async (req: Request, res: Response) => {
		const { id } = req.params
		const board: BoardType = {
			id,
			changeType: ChangeType.DELETE,
		}
		const returnIO = await boardFacade.save(board)
		return res.status(returnIO.status).json(returnIO)
	})

export default router
