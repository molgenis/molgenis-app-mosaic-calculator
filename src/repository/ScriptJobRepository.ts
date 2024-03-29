// @ts-ignore
import api from '@molgenis/molgenis-api-client'

const SCRIPT_NAME = 'molgenis_mosaic'

const getIdFromPollUrI = (pollUri: string) => pollUri.split('/').pop()

const poll = (pollId: string) => {
  return api.get('/api/v2/sys_job_ScriptJobExecution/' + pollId)
}

const run = (experimentId: string) => {
  const options = {
    headers: {
      'Accept': 'text/plain',
      'X-Requested-With': 'XMLHttpRequest'
    }
  }
  return api.post('/scripts/' + SCRIPT_NAME + '/submit?id=' + experimentId, options).then(
    (response: any) => {
      return response.text().then(getIdFromPollUrI)
    }
  )
}

export {
  run, poll
}
