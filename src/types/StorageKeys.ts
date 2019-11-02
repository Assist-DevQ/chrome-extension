export enum StorageKey {
  IsRecording = 'isRecording',
  RecordedEvents = 'events',
}

export interface IStorageProps {
  isRecording: boolean
  events: any[]
}
