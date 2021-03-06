import * as React from 'react'
import Record from './components/Record'
import { IRecordProps } from './components/types/record'

/* tslint:disable-next-line: no-var-requires */
const appStyles = require('./App.css')

class App extends React.Component<{}, {}> {
  public render() {
    return (
      <div className={appStyles.app}>
        <Record {...this.props as IRecordProps} />
      </div>
    )
  }
}

export default App
