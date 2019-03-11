import * as scriptJobRepository from '@/repository/ScriptJobRepository'
// @ts-ignore
import api from '@molgenis/molgenis-api-client'

jest.mock('@molgenis/molgenis-api-client', () => ({
  post: jest.fn(),
  get: jest.fn()
}))

describe('ScriptJobRepository', () => {
  describe('poll', () => {
    it('should use the api to poll the script job', () => {
      const pollId = 'poll-id'
      scriptJobRepository.poll(pollId)
      expect(api.get).toHaveBeenCalledWith('/api/v2/sys_job_ScriptJobExecution/poll-id')
    })
  })

  describe('run', () => {
    it('should use the api to run the script', (done) => {
      const experimentId = 'experiment-id'

      api.post.mockResolvedValue({ text: () => Promise.resolve('some/poll-id') })

      scriptJobRepository.run(experimentId).then((result: any) => {
        expect(result).toMatch('poll-id')
        done()
      })
      expect(api.post).toHaveBeenCalled()
    })
  })
})
