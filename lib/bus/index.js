/** @module bus */

import axios from 'axios'

export function fetchBusEstimateTime (sessionId, context, callback) {
  axios({
    url: 'http://data.ntpc.gov.tw/NTPC/od/data/api/CE74A94B-36D2-4482-A25D-670625ED0678',
    method: 'GET',
    params: {
      '$format': 'json',
      '$filter': `RouteID eq ${context.RouteID} and StationId eq ${context.StationId}`
    }
  }).then(response => {
    context.EstimateTime = response.data[0].EstimateTime
    callback(context)
  }).catch(response => {
    callback()
  })
}
