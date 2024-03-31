import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import cors from 'cors'
import userController from './controllers/UserController'
import boardController from './controllers/BoardController'
import panelController from './controllers/PanelController'
import taskController from './controllers/TaskController'
import authController from './controllers/AuthController'
import path from 'path'
import { HTTP_STATUS_CODES, InterfaceObject } from './lib/util/types'
import errorHandlingMiddleware from './middleware/ErrorHandlingMiddleware'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Routes
app.use('/api/v1/user', userController)
app.use('/api/v1/board', boardController)
app.use('/api/v1/panel', panelController)
app.use('/api/v1/task', taskController)
app.use('/api/v1/auth', authController)

app.get('/', (_: Request, res: Response) => {
	let returnIO: InterfaceObject<string> = {
		success: true,
		status: HTTP_STATUS_CODES.SUCCESS,
		data: 'Hi, Welcome to TaskFlow - Navigating Complexity, One Task at a Time',
	}
	res.status(returnIO.status).json(returnIO)
})

app.use('/assets', express.static(path.join(__dirname, '../public/assets')))

app.all('*', (_: Request, res: Response) => {
	let returnIO: InterfaceObject<string> = {
		success: true,
		status: HTTP_STATUS_CODES.NOT_FOUND,
		data: 'Hi, thanks for hitting our endpoint, but this endpoint has not been configured for any function. - Sincereley TaskFlow.',
	}
	res.status(returnIO.status).json(returnIO)
})

app.use(errorHandlingMiddleware)

app.listen(port, () => {
	console.log(
		`[server]: TaskFlow Server started, listening at Port - ${port}...`
	)
})
