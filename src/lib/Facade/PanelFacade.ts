import { PanelType } from '../util/types'
import PanelDAO from '../DAO/PanelDAO'
import BaseFacade from './BaseFacade'

export default class PanelFacade extends BaseFacade<PanelType> {
	private static _panelDAO = new PanelDAO()
	private panelDAO: PanelDAO
	constructor() {
		super(PanelFacade._panelDAO)
		this.panelDAO = PanelFacade._panelDAO
	}
}
