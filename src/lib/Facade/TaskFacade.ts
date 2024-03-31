import { TaskType } from '../util/types'
import TaskDAO from '../DAO/TaskDAO'
import BaseFacade from './BaseFacade'

export default class TaskFacade extends BaseFacade<TaskType> {
	private static _taskDAO = new TaskDAO()
	private taskDAO: TaskDAO
	constructor() {
		super(TaskFacade._taskDAO)
		this.taskDAO = TaskFacade._taskDAO
	}
}
