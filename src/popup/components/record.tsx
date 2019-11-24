import * as React from 'react'
import { Button, ButtonProps } from 'semantic-ui-react'
import { IMessage, MessageType } from '../../types/chrome/message/message'
import { ClientType } from '../../types/chrome/message/client-types'
import { IRecordProps, IRecordState } from './types/record'
import { ChromeApi } from '../service/chromeApi'
import { StorageKey } from '../../types/StorageKeys'

/* tslint:disable-next-line: no-var-requires */
const recordStyles = require('./Record.css')

class Record extends React.Component<IRecordProps, IRecordState> {
  private backPort: chrome.runtime.Port

  constructor(props: IRecordProps) {
    super(props)
    this.state = {
      isRecording: props.isRecording,
      eventsRecorded: 0
    }
    // This binding is necessary to make `this` work in the callback
    this.toggleRecordingState = this.toggleRecordingState.bind(this)
    this.record = this.record.bind(this)
    this.recording = this.recording.bind(this)
    this.backPort = chrome.runtime.connect({ name: ClientType.Popup })
    this.backPort.onMessage.addListener(this.onBackMessage.bind(this))
  }

  public async toggleRecordingState(event: React.MouseEvent<HTMLButtonElement>, data: ButtonProps): Promise<void> {
    try {
      await ChromeApi.setStoreKey(StorageKey.IsRecording, !this.state.isRecording)
      const tabId = await ChromeApi.getCurrentTabId()
      chrome.tabs.sendMessage(tabId, { record: !this.state.isRecording })
      this.setState((state: IRecordState) => ({
        ...state,
        isRecording: !state.isRecording
      }))
    } catch (e) {
      console.error(e.message)
    }
  }

  public record() {
    return (
      <Button color="green" onClick={this.toggleRecordingState}>
        Record
      </Button>
    )
  }

  public recording() {
    return (
      <Button color="red" onClick={this.toggleRecordingState}>
        Stop recording
      </Button>
    )
  }

  public render() {
    const button = this.state.isRecording ? <this.recording /> : <this.record />
    return (
      <div>
        {button}
        <div className={recordStyles.eventsContainer}>
          <i className="fas fa-file-code fa-2x" />
          <span className={recordStyles.events}>{this.state.eventsRecorded}</span>
        </div>
      </div>
    )
  }

  private onBackMessage(message: any, _: any) {
    const msg: IMessage<number> = message
    switch (msg.type) {
      case MessageType.UpdateCount:
        this.setState((state: any) => {
          return {
            ...state,
            eventsRecorded: msg.payload
          }
        })
        break
    }
  }
}

export default Record
