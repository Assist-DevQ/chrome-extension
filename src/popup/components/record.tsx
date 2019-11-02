import * as React from 'react'
import { Button, ButtonProps } from 'semantic-ui-react'

/* tslint:disable-next-line: no-var-requires */
const recordStyles = require('./Record.css')

class Record extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      isRecording: props.isRecording,
      eventsRecorded: 0
    }

    // This binding is necessary to make `this` work in the callback
    this.startRecording = this.startRecording.bind(this)
    this.stopRecording = this.stopRecording.bind(this)
    this.record = this.record.bind(this)
    this.recording = this.recording.bind(this)
    chrome.runtime.onMessage.addListener((msg, sen, resCb) => {
      this.setState((state: any) => {
        return {
          ...state,
          eventsRecorded: msg.eventsRecorded || state.eventsRecorded
        }
      })
    })
  }

  public startRecording(event: React.MouseEvent<HTMLButtonElement>, data: ButtonProps): void {
    chrome.storage.local.get((storage: any) => {
      chrome.storage.local.set(
        {
          ...storage,
          isRecording: true
        },
        () => {
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
            const id: number = tabs[0].id as number
            chrome.tabs.sendMessage(id, { record: true }, (res: any) => {
              this.setState((state: any) => ({
                ...state,
                isRecording: true
              }))
              console.log('resp from start recording:', res)
            })
          })
        }
      )
    })
  }

  public stopRecording(event: React.MouseEvent<HTMLButtonElement>, data: ButtonProps): void {
    console.log('stop')
    chrome.storage.local.get((storage: any) => {
      chrome.storage.local.set(
        {
          ...storage,
          isRecording: false
        },
        () => {
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
            const id: number = tabs[0].id as number
            chrome.tabs.sendMessage(id, { record: false }, (res: any) => {
              this.setState(() => ({
                isRecording: false
              }))
              console.log('resp from start recording:', res)
            })
          })
        }
      )
    })
  }

  public record() {
    return (
      <Button color="green" onClick={this.startRecording}>
        Record
      </Button>
    )
  }

  public recording() {
    return (
      <Button color="red" onClick={this.stopRecording}>
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
}

export default Record
