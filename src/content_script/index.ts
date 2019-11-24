// Original Source : https://github.com/iann0036/wildfire/blob/9bea9b4adb3399cba6020dcada760d329af9219f/content.js
import { DOMEvent } from './types/DOMEvent'
import { StorageKey } from '../types/StorageKeys'
import { MessageType } from '../types/chrome/message/message'
import { throttle } from './util/throttle'

const listeners: Map<string, EventListenerOrEventListenerObject[]> = new Map()

chrome.storage.local.get(StorageKey.IsRecording, (store: any) => {
  if (store.isRecording) {
    startRecording()
  } else {
    removeListeners()
  }
})

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log('message:', msg)
  if (msg.record === true) {
    console.log('starting to record')
    startRecording()
    chrome.runtime.sendMessage({ type: MessageType.Record, payload: true })
    chrome.runtime.sendMessage({
      type: MessageType.NewEvent,
      payload: {
        event: 'start',
        data: {url: window.location.href},
        time: Number(Date.now())
      }
    })
  } else if (msg.record === false) {
    console.log('stopping to record')
    removeListeners()
    chrome.runtime.sendMessage({
      type: MessageType.NewEvent,
      payload: {
        event: 'end',
        data: {url: window.location.href},
        time: Number(Date.now())
      }
    })
    chrome.runtime.sendMessage({ type: MessageType.StopRecording, payload: false })
  } else {
    sendResponse('unknown command.')
  }
})

const removeListeners = () => {
  console.log('removing listeners')
  Array.from(listeners.keys()).forEach((k: string) => {
    const lst = listeners.get(k)
    if (lst) {
      lst.forEach((l: EventListenerOrEventListenerObject) => {
        console.log('removing listener', k)
        document.body.removeEventListener(k, l)
      })
    }
  })
  const scl = listeners.get('scroll')
  if (scl) {
    window.removeEventListener('scroll', scl[0], false)
  }
}

const startRecording = () => {
  console.log('adding listeners')
  Object.values(DOMEvent).forEach(addDocumentEventListener)
}

function getCSSPath(el: any, ignoreIds: boolean) {
  if (!(el instanceof Element)) {
    return
  }
  const path = []
  while (el.nodeType === Node.ELEMENT_NODE) {
    let selector = el.nodeName.toLowerCase()
    if (el.id && !ignoreIds) {
      selector += '#' + el.id.replace(/(:|\.|\[|\]|,)/g, '\\$1')
      path.unshift(selector)
      break
    } else {
      let sib = el
      let nth = 1
      /* tslint:disable-next-line: no-conditional-assignment */
      while ((sib = sib.previousElementSibling)) {
        if (sib.nodeName.toLowerCase() === selector) {
          nth++
        }
      }
      if (nth !== 1) {
        selector += `:nth-of-type(${nth})`
      }
    }
    path.unshift(selector)
    el = el.parentNode
    if (el == null) {
      return
    }
  }
  return path.join(' > ')
}

const addDocumentEventListener = (eventName: string) => {
  const listener = listenerHandler(eventName)
  const evtListeners = listeners.get(eventName)
  if (evtListeners) {
    evtListeners.push(listener)
  } else {
    listeners.set(eventName, [listener])
  }
  if (eventName === DOMEvent.Scroll) {
    window.addEventListener(eventName, throttle(listener, 1000))
  } else {
    document.body.addEventListener(eventName, listener, false)
  }
}

function processPath(elementPath: any) {
  if (!elementPath) { return '' }

  const numPathElements = elementPath.length
  const path = []

  let uniqueEl = false
  for (let i = 0; i < numPathElements - 1 && !uniqueEl; i++) {
    if (elementPath[i].id != null && elementPath[i].id !== '') {
      uniqueEl = true
      path.push({
        uniqueId: elementPath[i].id,
        tagName: elementPath[i].tagName
      })
    } else {
      let childIndex = null
      for (let j = 0; elementPath[i].parentNode != null && j < elementPath[i].parentNode.childNodes.length; j++) {
        if (elementPath[i].parentNode.childNodes[j] === elementPath[i]) {
          childIndex = j
        }
      }
      if (childIndex == null && elementPath[i] === document) {
        // WTF
      } else {
        path.push({
          uniqueId: null,
          childIndex,
          tagName: elementPath[i].tagName
        })
      }
    }
  }

  return path
}

const listenerHandler = (eventName: string) => (e: Event | any) => {
  const mEvt = e as MouseEvent
  const kEvt = e as KeyboardEvent
  const eventData = {
    path: processPath(e.path),
    csspath: getCSSPath(e.target, false),
    csspathfull: getCSSPath(e.target, true),
    clientX: mEvt.clientX,
    clientY: mEvt.clientY,
    scrollX: window.scrollX,
    scrollY: window.scrollY,
    // altKey: mEvt.altKey,
    // ctrlKey: mEvt.ctrlKey,
    // shiftKey: mEvt.shiftKey,
    // metaKey: mEvt.metaKey,
    button: mEvt.button,
    // bubbles: e.bubbles,
    keyCode: -1,
    selectValue: '',
    value: '',
    type: '',
    // cancelable: e.cancelable,
    innerText: e.target ? (e.target as HTMLInputElement).innerText || '' : '',
    url: window.location.href
  }

  if (eventName === 'select') {
    eventData.selectValue = kEvt.target ? (kEvt.target as HTMLSelectElement).value : ''
  }

  if (eventName === 'keyup' || eventName === 'keydown' || eventName === 'keypress') {
    eventData.keyCode = kEvt.keyCode
  }

  if (eventName === 'input' || eventName === 'propertychange' || eventName === 'change') {
    eventData.type = kEvt.target ? (kEvt.target as HTMLInputElement).tagName.toLowerCase() : ''

    /* tslint:disable-next-line: prefer-conditional-expression */
    if (eventData.type === 'input' || eventData.type === 'textarea') {
      eventData.value = (e.target as HTMLInputElement).value
    } else {
      eventData.value = (e.target as HTMLInputElement).innerText
    }
  }

  if (eventName === 'cut') {
    eventName = 'clipboard_cut'
  }
  if (eventName === 'copy') {
    eventName = 'clipboard_copy'
  }
  if (eventName === 'paste') {
    eventName = 'clipboard_paste'
  }
  if (eventName === 'wfSubmit') {
    eventName = 'submit'
  }
  chrome.storage.local.get(StorageKey.IsRecording, (store: any) => {
    if (store.isRecording) {
      chrome.runtime.sendMessage({
        type: MessageType.NewEvent,
        payload: {
          event: eventName,
          data: eventData,
          time: Number(Date.now())
        }
      })
    }
  })
}
