import { BackAPI } from '../../../service/back-end.service'

export interface IRecordProps {
  isRecording: boolean
  api: BackAPI
}

export interface IRecordState {
  isRecording: boolean
  eventsRecorded: number
}
