/** Promise polyfill */
import 'babel-polyfill'
/** Promise based XMLHttpRequests client */
import axios from 'axios'

/** Class representing BotProvider. */
export default class BotProvider {
  /**
   *
   */
  constructor () {
    this.platform = 'messenger'
  }

  /**
   * sendMessage.
   * @param {} message
   * @return {Promise.<,>}
   */
  sendMessage (message) {
    return new Promise((resolve, reject) => {
      switch (this.platform) {
        case 'slack':
          reject()
          break
        case 'messenger':
          axios({
            method: 'POST',
            url: 'https://graph.facebook.com/v2.6/me/messages',
            params: {
              'access_token': process.env.FACEBOOK_PAGE_ACCESS_TOKEN
            },
            data: message
          }).then((response) => {
            resolve()
          }).catch((response) => {
            reject()
          })
          break
        case 'line':
          axios({
            method: 'POST',
            url: 'https://trialbot-api.line.me/v1/events',
            headers: {
              'Content-Type': 'application/json; charset=UTF-8',
              'X-Line-ChannelID': process.env.LINE_CHANNEL_ID,
              'X-Line-ChannelSecret': process.env.LINE_CHANNEL_SECRET,
              'X-Line-Trusted-User-With-ACL': process.env.LINE_MID
            },
            data: message
          }).then((response) => {
            resolve()
          }).catch((response) => {
            reject()
          })
          break
        default:
          reject()
          break
      }
    })
  }
}
