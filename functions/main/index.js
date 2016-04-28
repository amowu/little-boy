/** @module functions/main */

import 'babel-polyfill'
import { Wit } from 'node-wit'
import { fetchBusEstimateTime } from '../../lib/bus'

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

export default async (event, context, callback) => {
  console.log('event:', JSON.stringify(event, null, 2))

  // TODO: 解釋 callbackWaitForEmptyEventLoop
  context.callbackWaitForEmptyEventLoop = false

  try {
    const TMP_SESSION_ID = 999341730151342
    const TMP_MSG = 'estimated arrival times for the next 橘5 at 中正中山路口'

    // TODO:
    // Bot.createWitEngine(...)
    // const msg = await Bot.converse(TMP_MSG)
    const initialContext = {}
    const client = new Wit(process.env.WIT_SERVER_ACCESS_TOKEN, busAction)
    client.runActions(
      TMP_SESSION_ID,
      TMP_MSG,
      initialContext,
      (error, context) => {
        if (error) {
          console.log('Wit error:', error)
        } else {
          console.log('Wit ok:', JSON.stringify(context, null, 2))
        }
      }
    )

    // TODO:
    // const provider = new BotProvider()
    // const result = await provider.sendMessage({
    //   recipient: {
    //     id: 999341730151342
    //   },
    //   message: {
    //     text: msg
    //   }
    // })

    callback(null, 'done')
  } catch (error) {
    console.log('ERROR:', JSON.stringify(error, null, 2))
    callback('Fail object', 'Failed result')
  }
  // TODO: 1. 寫一支 provider 過濾＆統一各平台的輸入
  // TODO: 2. 使用 wit.ai 將字串作語意分析
  // TODO: 3. 將 step 2 的結果丟給一支 router 執行對應的 command
  // TODO: 4. 將 step 3 的結果丟給 provider send message
}
