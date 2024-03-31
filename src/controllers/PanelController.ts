import PanelFacade from '../lib/Facade/PanelFacade'
import { ChangeType, PanelType } from '../lib/util/types'
import express, { Request, Response } from 'express'
import authMiddleware from '../middleware/AuthMiddleware'

const router = express.Router()

router.use(authMiddleware)

const panelFacade = new PanelFacade()

router
	.get('/:id', async (req: Request, res: Response) => {
		const { id } = req.params
		const returnIO = await panelFacade.retrieveByID(id)
		return res.status(returnIO.status).json(returnIO)
	})
	.post('/', async (req: Request, res: Response) => {
		const { name, boardId, sortOrder } = req.body
		const panel: PanelType = {
			name,
			boardId,
			sortOrder,
			changeType: ChangeType.INSERT,
		}
		const returnIO = await panelFacade.save(panel)
		return res.status(returnIO.status).json(returnIO)
	})
	.put('/:id', async (req: Request, res: Response) => {
		const { id } = req.params
		const { name, boardId, sortOrder } = req.body
		const panel: PanelType = {
			id,
			name,
			boardId,
			sortOrder,
			changeType: ChangeType.UPDATE,
		}
		const returnIO = await panelFacade.save(panel)
		return res.status(returnIO.status).json(returnIO)
	})
	.delete('/:id', async (req: Request, res: Response) => {
		const { id } = req.params
		const panel: PanelType = {
			id,
			changeType: ChangeType.DELETE,
		}
		const returnIO = await panelFacade.save(panel)
		return res.status(returnIO.status).json(returnIO)
	})

export default router
