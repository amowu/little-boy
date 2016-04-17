/** @module functions/main */

export default function (event, context, callback) {
  console.log('event:', JSON.stringify(event, null, 2))
  context.callbackWaitForEmptyEventLoop = false 
  callback(null, event)
  //callback('Fail object', 'Failed result')
  
  // TODO: 1. 寫一支 provider 過濾＆統一各平台的輸入
  // TODO: 2. 使用 wit.ai 將字串作語意分析
  // TODO: 3. 將 step 2 的結果丟給一支 router 執行對應的 command
  // TODO: 4. 將 step 3 的結果丟給 provider send message
}