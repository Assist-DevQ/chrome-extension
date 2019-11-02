import { IStorageProps } from '../types/StorageKeys'

const defaultStorage: IStorageProps = {
  isRecording: false,
  events: []
}

chrome.storage.local.set(defaultStorage)
