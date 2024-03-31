import TaskFacade from '../lib/Facade/TaskFacade'
import { ChangeType, TaskType } from '../lib/util/types'
import express, { Request, Response } from 'express'
import authMiddleware from '../middleware/AuthMiddleware'

const router = express.Router()

router.use(authMiddleware)

const taskFacade = new TaskFacade()

router
	.get('/:id', async (req: Request, res: Response) => {
		const { id } = req.params
		const returnIO = await taskFacade.retrieveByID(id)
		return res.status(returnIO.status).json(returnIO)
	})
	.post('/', async (req: Request, res: Response) => {
		const {
			title,
			description,
			panelId,
			assignedToId,
			authorId,
			priority,
			sortOrder,
		} = req.body
		const task: TaskType = {
			title,
			description,
			panelId,
			assignedToId,
			authorId,
			priority,
			sortOrder,
			changeType: ChangeType.INSERT,
		}
		const returnIO = await taskFacade.save(task)
		return res.status(returnIO.status).json(returnIO)
	})
	.put('/:id', async (req: Request, res: Response) => {
		const { id } = req.params
		const {
			title,
			description,
			panelId,
			assignedToId,
			authorId,
			priority,
			sortOrder,
		} = req.body
		const task: TaskType = {
			id,
			title,
			description,
			panelId,
			assignedToId,
			authorId,
			priority,
			sortOrder,
			changeType: ChangeType.UPDATE,
		}
		const returnIO = await taskFacade.save(task)
		return res.status(returnIO.status).json(returnIO)
	})
	.delete('/:id', async (req: Request, res: Response) => {
		const { id } = req.params
		const task: TaskType = {
			id,
			changeType: ChangeType.DELETE,
		}
		const returnIO = await taskFacade.save(task)
		return res.status(returnIO.status).json(returnIO)
	})

export default router
