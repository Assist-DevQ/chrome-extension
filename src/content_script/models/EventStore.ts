import { IEventProps } from '../types/EventProps'

export class EventStore {
  private events: IEventProps[] = []

  public add(e: IEventProps): void {
    this.events.push(e)
    chrome.runtime.sendMessage({ eventsRecorded: this.events.length })
  }

  public getAll(): IEventProps[] {
    return [...this.events]
  }

  public flush(): void {
    this.events.length = 0
  }
}
