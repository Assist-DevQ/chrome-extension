import { IMessage, MessageType } from '../types/message/message'
import { EventsStore } from './events-store'
import { IEventProps } from '../types/EventProps'

export type MessageListenerType<T> = (
  message: IMessage<T>,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: any) => void
) => void

export class MessageListener {
  public static build<T extends IEventProps>(): MessageListenerType<T> {
    console.log('adding background listener')
    let eventStore = new EventsStore()
    return (msg, sen, resCb) => {
      console.log('MEssage:', msg)
      switch (msg.type) {
        case MessageType.Record:
          eventStore = new EventsStore()
          break
        case MessageType.StopRecording:
          eventStore.store()
          console.log('Recorded events:', eventStore.events)
          break
        case MessageType.NewEvent:
          eventStore.add(msg.payload)
          break
        default:
          console.log('UNKNOWN MESSAGE: ', msg)
      }
    }
  }
}
