import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'

import './index.css'
import { StorageKey } from '../types/StorageKeys'
import { BackAPI } from '../service/back-end.service'
import { ChromeApi } from './service/chromeApi'

ChromeApi.getStoreKey([StorageKey.IsRecording, StorageKey.ProjectId, StorageKey.ScenarioId]).then((store) => {
  const api = BackAPI.getInstance()
  const props = {...store, api}
  ReactDOM.render(<App {...props}/>, document.getElementById('root') as HTMLElement)
})
