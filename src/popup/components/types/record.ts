import { BackAPI } from '../../../service/back-end.service'
import { DropdownItemProps } from 'semantic-ui-react'

export interface IRecordProps {
  isRecording: boolean
  api: BackAPI
}

export interface IRecordState {
  isRecording: boolean
  eventsRecorded: number
  projects: DropdownItemProps[]
  scenarios: DropdownItemProps[]
  selectedProjectId?: number
  selectedScenarioId?: number
}
