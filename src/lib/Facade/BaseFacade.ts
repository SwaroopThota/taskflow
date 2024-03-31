import {
	BaseObjectType,
	ChangeType,
	HTTP_STATUS_CODES,
	IDListType,
	IDType,
	InterfaceObject,
} from '../util/types'
import BaseDAO from '../DAO/BaseDAO'
import CustomError from '../util/error handling/CustomError'
require('express-async-errors')

export default class BaseFacade<T extends BaseObjectType> {
	private dao: BaseDAO<T>
	constructor(dao: BaseDAO<T>) {
		this.dao = dao
	}

	async retrieveByID(id: IDType) {
		const data = await this.dao.retrieve([id])
		if (data.length === 0) {
			throw new CustomError(
				'Resource not found.',
				HTTP_STATUS_CODES.NOT_FOUND
			)
		}
		const returnIO: InterfaceObject<T> = {
			success: true,
			status: HTTP_STATUS_CODES.SUCCESS,
			data: data[0],
		}
		return returnIO
	}

	async retrieve(ids: IDListType) {
		const data = await this.dao.retrieve(ids)
		const returnIO: InterfaceObject<T[]> = {
			success: true,
			status: HTTP_STATUS_CODES.SUCCESS,
			data,
		}
		return returnIO
	}

	save(obj: T) {
		switch (obj.changeType) {
			case ChangeType.INSERT:
				return this.insert(obj)
			case ChangeType.UPDATE:
				return this.update(obj)
			case ChangeType.DELETE:
				return this.delete(obj)
		}
		throw new CustomError('ChangeType not found.')
	}

	async insert(obj: T) {
		const data = await this.dao.insert(obj)
		const returnIO: InterfaceObject<IDType> = {
			success: true,
			status: HTTP_STATUS_CODES.RESOURCE_CREATED,
			data,
		}
		return returnIO
	}

	async update(obj: T) {
		await this.dao.update(obj)
		const returnIO: InterfaceObject<void> = {
			success: true,
			status: HTTP_STATUS_CODES.RESOURCE_UPDATED,
		}
		return returnIO
	}

	async delete(obj: T) {
		await this.dao.delete(obj)
		const returnIO: InterfaceObject<void> = {
			success: true,
			status: HTTP_STATUS_CODES.RESOURCE_UPDATED,
		}
		return returnIO
	}
}
