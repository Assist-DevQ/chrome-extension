export enum MessageType {
  Record = 'record',
  StopRecording = 'stopRecording',
  NewEvent = 'newEvent',
  UpdateCount = 'updateCount',
  MemoryCount = 'memoryCount',
}

export interface IMessage<T> {
  type: MessageType,
  payload: T
}
