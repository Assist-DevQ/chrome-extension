import { IStorageProps } from '../types/StorageKeys'
import { MessageListener } from './message-listener'
import { IEventProps } from '../types/EventProps'
import { ClientType } from '../types/message/client-types'
import { any } from 'prop-types'
import { MessageType } from '../types/message/message'

const defaultStorage: IStorageProps = {
  isRecording: false,
  events: []
}

console.log('setting default storage')
chrome.storage.local.set(defaultStorage)
const listenerBuilder = new MessageListener()
chrome.runtime.onMessage.addListener(listenerBuilder.buildForContent<IEventProps>())
chrome.runtime.onConnect.addListener(listenerBuilder.buildForPopup())
