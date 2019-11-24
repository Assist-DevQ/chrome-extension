import { IStorageProps, StorageKey } from '../../types/StorageKeys'

export class ChromeApi {
  public static getStoreKey(key: StorageKey): Promise<IStorageProps> {
    return new Promise((res, _) => {
      chrome.storage.local.get(key, (store: any) => {
        res(store)
      })
    })
  }

  public static setStoreKey(key: StorageKey, value: any): Promise<void> {
    return new Promise((res, _) => {
      chrome.storage.local.set({ [key]: value }, res)
    })
  }

  public static getCurrentTabId(): Promise<number> {
    return new Promise((res, rej) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
        if (tabs.length === 0 || tabs[0].id === undefined) { rej(new Error('No active tabs found')) }
        res(tabs[0].id)
      })
    })
  }
}
