import * as jobService from '@/service/JobService'
import * as scriptJobRepository from '@/repository/ScriptJobRepository'

jest.mock('@/repository/ScriptJobRepository', () => ({
  run: jest.fn(),
  poll: jest.fn()
}))

describe('JobService', () => {

  describe('runJob', () => {
    it('should call the script and start polling', (done) => {
      // @ts-ignore
      scriptJobRepository.run.mockResolvedValue('scriptJobId')
      // @ts-ignore
      scriptJobRepository.poll.mockResolvedValue({
        status: 'SUCCESS',
        resultUrl: 'some-url'
      })
      jobService.runJob('exp-id')
      expect(scriptJobRepository.run).toHaveBeenCalled()
      /*
       * jest mock timers has issues mocking setInterval, just use timeout as workaround :(
       */
      setTimeout(() =>{
        expect(scriptJobRepository.poll).toHaveBeenCalled()
        done()
      }, 2000)
    })

    it('should return an error if there is a issue during polling', (done) => {
      // @ts-ignore
      scriptJobRepository.run.mockResolvedValue('scriptJobId')
      // @ts-ignore
      scriptJobRepository.poll.mockResolvedValue({
        status: 'ERROR',
      })


      jobService.runJob('exp-id').catch( (e:any) => {
        expect(e.message).toMatch('Could not run job.')
        done()
      })

      setTimeout(() => {}, 2000)
      }
    )
  })

  describe('cancelPolling', () => {

  })

})
