import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'

import './index.css'
import { StorageKey } from '../types/StorageKeys'
import { BackAPI } from '../service/back-end.service'

chrome.storage.local.get(StorageKey.IsRecording, (store) => {
  const api = BackAPI.getInstance()
  const props = {...store, api}
  ReactDOM.render(<App {...props}/>, document.getElementById('root') as HTMLElement)
})
