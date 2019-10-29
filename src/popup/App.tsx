import * as React from 'react'

/* tslint:disable-next-line: no-var-requires */
const appStyles = require('./App.css')
/* tslint:disable-next-line: no-var-requires */
const logo = require('./logo.svg')

class App extends React.Component<{}, {}> {
  public sendMSg() {
    console.log('sending msg')
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
      const id: number = tabs[0].id as number
      chrome.tabs.sendMessage(id, { color: 'red' }, (res: any) => {
        console.log('resp:', res)
      })
    })
  }
  public render() {
    const formattedTime: string = new Date().toLocaleTimeString('en-us', {
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      month: 'numeric',
      second: '2-digit',
      year: 'numeric',
    })
    chrome.runtime.onMessage.addListener((msg, sen, resCb) => {
      console.log('mess recv:', msg)
    })
    return (
      <div className={appStyles.app}>
        <div className={appStyles.appHeader}>
          <img src={logo} className={appStyles.appLogo} alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className={appStyles.appIntro}>
          To get started, edit <code>src/popup/App.tsx</code>
        </p>
        <p>
          Right click and select <strong>Inspect</strong>
          to open DevTools. In DevTools, press <code>Ctrl+R</code> to reload
        </p>
        <hr />
        <p>Rendered at {formattedTime}</p>
        <button type="button" onClick={this.sendMSg}>
          send mess
        </button>
      </div>
    )
  }
}

export default App
