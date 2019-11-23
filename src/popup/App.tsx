import * as React from 'react'
import Record from './components/Record'
import { BackAPI } from '../service/back-end.service'

/* tslint:disable-next-line: no-var-requires */
const appStyles = require('./App.css')

class App extends React.Component<{}, {}> {
  public render() {
    BackAPI.getInstance().getProjects().then((p: any) => console.log('adasd', p))
    return (
      <div className={appStyles.app}>
        <Record {...this.props} />
      </div>
    )
  }
}

export default App
