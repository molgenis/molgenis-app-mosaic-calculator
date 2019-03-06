// @ts-ignore
import api from '@molgenis/molgenis-api-client'

const SCRIPT_NAME = 'Mosaic-4'

const getIdFromPollUrI = (pollUri: string) => pollUri.split('/').pop()

const poll = (pollId: string) => {
  return api.get('/api/v2/sys_job_ScriptJobExecution/' + pollId)
}

const run = (id: string) => {
  const options = {
    headers: {
      'Accept': 'text/plain',
      'X-Requested-With': 'XMLHttpRequest'
    }
  }
  return api.post('/scripts/' + SCRIPT_NAME + '/submit?id=' + id, options).then(
    (response: any) => {
      return response.text().then(getIdFromPollUrI)
    }
  )
}

export {
  run, poll
}
