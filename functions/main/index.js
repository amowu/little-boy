/** @module functions/main */

import 'babel-polyfill'
import { get } from 'lodash'
import { Wit } from 'node-wit'

import BotProvider from '../../cores/BotProvider'
import { fetchBusEstimateTime } from '../../lib/bus'

export default async (event, context, callback) => {
  console.log('event:', JSON.stringify(event, null, 2))

  // TODO: 解釋 callbackWaitForEmptyEventLoop
  context.callbackWaitForEmptyEventLoop = false

  try {
    const messaging = event.entry[0].messaging[0]
    const senderId = messaging.sender.id
    const text = get(messaging, ['message', 'text'])

    // TODO: 這邊的返回感覺寫得不好，Facebook 沒事多發一個 watermark 幹嘛...
    const watermark = get(messaging, ['delivery', 'watermark'])
    if (watermark) return callback(null, 'watermark')

    // TODO:
    // Bot.createWitEngine(...)
    // const msg = await Bot.converse(TMP_MSG)
    // ---
    const TMP_SESSION_ID = 999341730151342
    const TMP_MSG = 'estimated arrival times for the next 橘5 at 中正中山路口'
    // const result = await converse(TMP_SESSION_ID, TMP_MSG)
    // TODO: 接下來要想辦法拿到 wit 的 say 然後 send message

    // TODO:
    const provider = new BotProvider()
    await provider.sendMessage({
      recipient: {
        id: senderId
      },
      message: {
        text: text
      }
    })

    callback(null, 'done')
  } catch (error) {
    console.log('ERROR:', JSON.stringify(error, null, 2))
    callback(error)
  }
}

// TODO: Wit.ai 的 merge 用 function，待 refactor
function firstEntityValue (entities, entity) {
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value
  if (!val) {
    return null
  }
  return typeof val === 'object' ? val.value : val
}

// TODO: Wit.ai 的參數，待 refactor
const busAction = {
  merge: (sessionId, context, entities, message, callback) => {
    console.log('merge:', JSON.stringify(context, null, 2))
    console.log('entities:', JSON.stringify(entities, null, 2))
    const bus = firstEntityValue(entities, 'bus')
    const location = firstEntityValue(entities, 'location')
    if (bus && location) {
      context.RouteID = 121
      context.StationId = 6038
    }
    callback(context)
  },
  say: (sessionId, context, message, callback) => {
    console.log('say:', message)
    context.msg = message
    callback()
  },
  error: (sessionId, context, error) => {
    console.log('error:', error.message)
  },
  'fetchBusEstimateTime': fetchBusEstimateTime
}

function converse (sessionId, message) {
  return new Promise((resolve, reject) => {
    const initialContext = {}
    const client = new Wit(process.env.WIT_SERVER_ACCESS_TOKEN, busAction)
    client.runActions(
      sessionId,
      message,
      initialContext,
      (error, context) => {
        if (error) {
          console.log('Wit ERROR:', error)
          reject(error)
        } else {
          console.log('Wit OK:', JSON.stringify(context, null, 2))
          resolve(context)
        }
      }
    )
  })
}

// Note:
//
// BotProvier:
//
// - routes messages
// - manage state
// - bot registration, directory
// - session tracking
// - services (translation...)
// - per user, per bot storage
// - SDK, APIs

// you need a new Message() with:
// - The From and To fields swapped from the original message (so that it will be routed back to where it came from)
// - The conversationId from the original message on it (so you can send it back to the same conversation)
// - The new Text
// - The language of your text.

// Replying to a message immediately:
// return incomingMessage.CreateReplyMessage("Yo, I got it.", "en"): Message
//
// Replying to the message later:
// const replyMessage = incomingMessage.CreateReplyMessage("Yo, I got it.", "en")
// var connector = new ConnectorClient()
// await connector.Messages.SendMessageAsync(replyMessage)

// Example of starting a new conversation with a user:
// var connector = new ConnectorClient()
// Message message = new Message()
// message.From = botChannelAccount
// message.To = new ChannelAddress() {ChannelId = "email", "Address":"joe@hotmail.com"}
// message.Text = "Hey, what's up homey?"
// message.Language = "en"
// connector.Messages.SendMessage(message)

// TODO: 1. 寫一支 provider 過濾＆統一各平台的輸入
// const message = provider(event).createIncomingMessage()
// if (message.type === 'text' | 'video' | 'audio' | 'image' | ...)

// TODO: 2. 使用 wit.ai 將字串作語意分析

// TODO: 3. 將 step 2 的結果丟給一支 router 執行對應的 command

// TODO: 4. 將 step 3 的結果丟給 provider send message
// const connector = new ConnectorClient()
// const reply = message.CreateReplyMessage({...}, 'en')
// connector.sendMessage(reply)