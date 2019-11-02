// import * as React from 'react'
// import { Button, ButtonProps } from 'semantic-ui-react'

// class Record extends React.Component<{}, {}> {
//   public isRecording: boolean = false
//   public startRecording(event: React.MouseEvent<HTMLButtonElement>, data: ButtonProps): void {
//     chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
//       const id: number = tabs[0].id as number
//       chrome.tabs.sendMessage(id, { record: true }, (res: any) => {
//         this.isRecording = true
//         console.log('resp from start recording:', res)
//       })
//     })
//   }

//   public stopRecording(event: React.MouseEvent<HTMLButtonElement>, data: ButtonProps): void {
//     console.log('stop')
//     this.isRecording = false
//   }

//   public record() {
//     return (
//       <Button color="green" onClick={this.startRecording}>
//         Record
//       </Button>
//     )
//   }

//   public recording() {
//     return (
//       <Button color="red" onClick={this.stopRecording}>
//         Stop recording
//       </Button>
//     )
//   }

//   public render() {
//     if (this.isRecording) {
//       return <this.recording />
//     } else {
//       return <this.record />
//     }
//   }
// }

// export default Record
