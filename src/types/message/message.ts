export enum MessageType {
  Record = 'record',
  StopRecording = 'stopRecording',
  NewEvent = 'newEvent'
}

export interface IMessage<T> {
  type: MessageType,
  payload: T
}
