import express, { Request, Response } from 'express'
import { HTTP_STATUS_CODES, InterfaceObject } from '../lib/util/types'
import { getGithubLoginURL, handleGitHubUserLogin } from '../auth/GithubAuth'
require('express-async-errors')

const router = express.Router()

router
	.get('/githubLoginURL', (_: Request, res: Response) => {
		const returnIO: InterfaceObject<string> = {
			success: true,
			status: 200,
			data: getGithubLoginURL(),
		}
		return res.status(returnIO.status).json(returnIO)
	})
	.get('/login/github', async (req: Request, res: Response) => {
		const code = req.query.code || ''
		const data = await handleGitHubUserLogin(code as string)
		const returnIO: InterfaceObject<string> = {
			success: true,
			status: HTTP_STATUS_CODES.RESOURCE_CREATED,
			data,
		}
		return res.status(returnIO.status).json(returnIO)
	})

export default router
