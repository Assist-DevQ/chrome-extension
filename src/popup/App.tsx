import * as React from 'react'
import Record from './components/record'

/* tslint:disable-next-line: no-var-requires */
const appStyles = require('./App.css')
/* tslint:disable-next-line: no-var-requires */
const logo = require('./logo.svg')

class App extends React.Component<{}, {}> {
  public render() {
    chrome.runtime.onMessage.addListener((msg, sen, resCb) => {
      console.log('mess recv:', msg)
    })
    return (
      <div className={appStyles.app}>
        <div className={appStyles.appHeader}>
          <img src={logo} className={appStyles.appLogo} alt="logo" />
          <h2>DevQ recorder</h2>
        </div>
        <Record />
      </div>
    )
  }
}

export default App
