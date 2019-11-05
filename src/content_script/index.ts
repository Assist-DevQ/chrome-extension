// Original Source : https://github.com/iann0036/wildfire/blob/9bea9b4adb3399cba6020dcada760d329af9219f/content.js
import { DOMEvent } from './types/DOMEvent'
import { StorageKey, IStorageProps } from '../types/StorageKeys'
import { MessageType } from '../types/message/message'

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
  } else if (msg.record === false) {
    console.log('stopping to record')
    removeListeners()
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
  const scrollListener = (e: Event) => {
    setTimeout(() => {
      console.log('onScroll', e) // TODO: get right values
    }, 100)
  }
  listeners.set('scroll', [scrollListener])
  window.addEventListener('scroll', scrollListener, false)
}

// const updateScrollEvent = () => {
//   const scrollTimeMs = 100
//   if (scrollProps.object == null) {
//     scrollProps.startTime = Date.now()
//     scrollProps.object = document.body
//     scrollProps.startTop = scrollProps.scrollTop
//     scrollProps.startLeft = scrollObject.scrollLeft
//     scrollProps.timer = setTimeout(finishScrollEvent, scrollTimeMs)
//   } else {
//     if (scrollProps.timer) {
//       clearTimeout(scrollProps.timer as NodeJS.Timer)
//     }
//     scrollProps.timer = setTimeout(finishScrollEvent, scrollTimeMs)
//   }
// }

// const finishScrollEvent = () => {
//   scrollObject = document.body

//   eventStore.add({
//     event: 'scroll',
//     data: {
//       scrollTopStart: scrollProps.startTop,
//       scrollTopEnd: scrollObject.scrollTop,
//       scrollLeftStart: scrollProps.startLeft,
//       scrollLeftEnd: scrollObject.scrollLeft,
//       url: window.location.href
//     },
//     time: Number(Date.now())
//   })

//   scrollProps.startTop = 0
//   scrollProps.startLeft = 0
// }

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
  document.body.addEventListener(eventName, listener, false)
}

const listenerHandler = (eventName: string) => (e: Event) => {
  const mEvt = e as MouseEvent
  const kEvt = e as KeyboardEvent
  const eventData = {
    // path: processPath(e.path),
    csspath: getCSSPath(e.target, false),
    csspathfull: getCSSPath(e.target, true),
    clientX: mEvt.clientX,
    clientY: mEvt.clientY,
    altKey: mEvt.altKey,
    ctrlKey: mEvt.ctrlKey,
    shiftKey: mEvt.shiftKey,
    metaKey: mEvt.metaKey,
    button: mEvt.button,
    bubbles: e.bubbles,
    keyCode: -1,
    selectValue: '',
    value: '',
    type: '',
    cancelable: e.cancelable,
    innerText: e.target ? e.target || '' : '',
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
