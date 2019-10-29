chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log('message:', msg)
  if (msg.color) {
    console.log('Receive color = ' + msg.color)
    document.body.style.backgroundColor = msg.color
    sendResponse('Change color to ' + msg.color)
    chrome.runtime.sendMessage({ a: 3 })
  } else {
    sendResponse('Color message is none.')
  }
})
console.log('working')
