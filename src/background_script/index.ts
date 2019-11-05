import { IStorageProps } from '../types/StorageKeys'
import { MessageListener } from './message-listener'
import { IEventProps } from '../types/EventProps'

const defaultStorage: IStorageProps = {
  isRecording: false,
  events: []
}

console.log('setting default storage')
chrome.storage.local.set(defaultStorage)

chrome.runtime.onMessage.addListener(MessageListener.build<IEventProps>())
