import { IMessage, MessageType } from '../types/chrome/message/message'
import { EventsStore } from './events-store'
import { IEventProps } from '../types/EventProps'
import { ClientType } from '../types/chrome/message/client-types'
import { BackAPI } from '../service/back-end.service'

export type MessageListenerType<T> = (
  message: IMessage<T>,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: any) => void
) => void

export type ConnectionListenerType = (port: chrome.runtime.Port) => void

export class MessageListener {
  public eventStore = new EventsStore()
  private popupPort?: chrome.runtime.Port
  private readonly api: BackAPI

  constructor(api: BackAPI) {
    this.api = api
  }

  public buildForContent<T extends IEventProps | number>(): MessageListenerType<T> {
    console.log('adding background listener')
    return (msg, sen, resCb) => {
      switch (msg.type) {
        case MessageType.Record:
          this.eventStore = new EventsStore()
          break
        case MessageType.StopRecording:
          console.log('JSON:', JSON.stringify(this.eventStore.events))
          this.api.saveEvents(msg.payload as number, this.eventStore.events).then(() => {
            this.eventStore.clean()
          })
          break
        case MessageType.NewEvent:
          this.eventStore.add(msg.payload as IEventProps)
          this.postCountMessage()
          break
        default:
          console.log('UNKNOWN MESSAGE: ', msg)
      }
    }
  }

  public buildForPopup(): ConnectionListenerType {
    return (port: chrome.runtime.Port) => {
      console.log('New Connection from:', port.name)
      if (port.name === ClientType.Popup) {
        this.popupPort = port
        this.popupPort.onDisconnect.addListener(() => {
          console.log('Closed connection to popup')
          this.popupPort = undefined
        })
        this.postCountMessage()
      }
    }
  }

  private postCountMessage(): void {
    if (this.popupPort) {
      this.popupPort.postMessage({ type: MessageType.UpdateCount, payload: this.eventStore.events.length })
    }
  }
}
