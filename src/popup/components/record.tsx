import * as React from 'react'
import { Button, ButtonProps, Container } from 'semantic-ui-react'

class Record extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = { isRecording: false }

    // This binding is necessary to make `this` work in the callback
    this.startRecording = this.startRecording.bind(this)
    this.stopRecording = this.stopRecording.bind(this)
    this.record = this.record.bind(this)
    this.recording = this.recording.bind(this)
  }

  public startRecording(event: React.MouseEvent<HTMLButtonElement>, data: ButtonProps): void {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
      const id: number = tabs[0].id as number
      chrome.tabs.sendMessage(id, { record: true }, (res: any) => {
        this.setState(() => ({
          isRecording: true
        }))
        console.log('resp from start recording:', res)
      })
    })
  }

  public stopRecording(event: React.MouseEvent<HTMLButtonElement>, data: ButtonProps): void {
    console.log('stop')
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
    return <Container text>{button}</Container>
  }
}

export default Record
