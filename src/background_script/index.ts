import { IStorageProps } from '../types/StorageKeys'
import { MessageListener } from './message-listener'
import { IEventProps } from '../types/EventProps'
import { BackAPI } from '../service/back-end.service'

const defaultStorage: IStorageProps = {
  isRecording: false,
  events: []
}

console.log('setting default storage')
chrome.storage.local.set(defaultStorage)
const listenerBuilder = new MessageListener(BackAPI.getInstance())
chrome.runtime.onMessage.addListener(listenerBuilder.buildForContent<IEventProps>())
chrome.runtime.onConnect.addListener(listenerBuilder.buildForPopup())
