import { IEventProps } from '../EventProps'

export interface IScenario {
  id: number
  name: string
}

export interface IBatchEvents {
  scenario_id: number
  events: IEventProps[]
}
