export enum StorageKey {
  IsRecording = 'isRecording',
  Events = 'events',
  ProjectId = 'projectId',
  ScenarioId = 'scenarioId'
}

export interface IStorageProps {
  isRecording: boolean
  events: any[]
  projectId?: number
  scenarioId?: number
}
