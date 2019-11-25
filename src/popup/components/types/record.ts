import { BackAPI } from '../../../service/back-end.service'
import { IProject } from '../../../types/api/project'
import { IScenario } from '../../../types/api/scenario'

export interface IRecordProps {
  isRecording: boolean
  api: BackAPI
  projectId: number
  scenarioId: number
}

export interface IRecordState {
  isRecording: boolean
  eventsRecorded: number
  projects?: IProject[]
  scenarios?: IScenario[]
  selectedProjectId?: number
  selectedScenarioId?: number
}
