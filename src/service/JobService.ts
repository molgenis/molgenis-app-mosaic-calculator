import * as scriptJobRepository from '@/repository/ScriptJobRepository'

let interval:any = null

const runJob = (experimentId: string) => {
  return scriptJobRepository.run(experimentId).then((scriptJobId: string) => {
    return pollJob(scriptJobId)
  })
}

const pollJob = (scriptJobId: string) => {
  return new Promise((resolve, reject) => {
    interval = setInterval(() => {
      scriptJobRepository.poll(scriptJobId).then((pollResponse: any) => {
        if (pollResponse.status !== 'RUNNING') {
          cancelPolling()
          if (pollResponse.status === 'SUCCESS') {
            resolve(pollResponse.resultUrl)
          } else {
            reject(Error('Could not run job.'))
          }
        }
      }, () => {
        reject(Error('Could not run job.'))
      })
    }, 1000)
  })
}

const cancelPolling = () => {
  if (clearInterval && interval) {
    clearInterval(interval)
  }
}

export {
  runJob, cancelPolling
}
