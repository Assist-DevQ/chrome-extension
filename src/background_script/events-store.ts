import { IEventProps } from '../types/EventProps'

export class EventsStore {
  public events: IEventProps[] = []

  public add(e: IEventProps): void {
    this.events.push(e)
  }

  // public store(): Promise<void> {
  //   return new Promise((resolve, _) => {
  //     chrome.storage.local.set({ events: this.events }, resolve)
  //   })
  // }

  public clean() {
    this.events.length = 0
  }
}
