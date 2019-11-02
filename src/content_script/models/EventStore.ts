import { IEventProps } from '../types/EventProps'

export class EventStore {
  private events: IEventProps[] = []

  public add(e: IEventProps): void {
    this.events.push(e)
    chrome.runtime.sendMessage({ eventsRecorded: this.events.length })
  }

  public flush(): void {
    chrome.runtime.sendMessage({ recording: false, events: [...this.events] })
    this.events.length = 0
  }
}
