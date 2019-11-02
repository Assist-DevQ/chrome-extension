import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'

import './index.css'
import { StorageKey } from '../types/StorageKeys'

chrome.storage.local.get(StorageKey.IsRecording, (store) => {
  ReactDOM.render(<App {...store}/>, document.getElementById('root') as HTMLElement)
})
