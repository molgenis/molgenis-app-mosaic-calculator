import * as experimentRepository from '@/repository/ExperimentRepository'
// @ts-ignore
import api from '@molgenis/molgenis-api-client'

jest.mock('@molgenis/molgenis-api-client', () => ({
  post: jest.fn(),
  delete_: jest.fn()
}))

describe('ExperimentRepository', () => {
  describe('saveExpData', () => {
    it('should call the api to store the server', () => {
      const expData = {
        gender: 'Female',
        eventFile: new Blob(),
        snpFile: new Blob()
      }

      api.post.mockResolvedValue({
        headers: {
          get: () => 'https://mock/location/id'
        }
      })

      experimentRepository.saveExpData(expData)
      expect(api.post).toHaveBeenCalled()
    })
  })

  describe('saveResultFileId', () => {
    it('should use the api to store the results file id', () => {
      const experimentId = 'exp-id'
      const resultFileUri = '/some/uri/with/res-id'
      experimentRepository.saveResultFileId(experimentId, resultFileUri)

      const expectedOptions = {
        body: 'res-id',
        method: 'PUT'
      }

      expect(api.post).toHaveBeenCalledWith('/api/v1/mosaic_exp_data/exp-id/resultFileId', expectedOptions)
    })
  })

  describe('removeData', () => {
    it('should delete the results and then delete the experiment data', (done) => {
      const experimentId = 'exp-id'
      const resultFileUri = '/some/uri/with/res-id'

      api.delete_.mockResolvedValue()

      experimentRepository.removeData(experimentId, resultFileUri).then(() => {
        expect(api.delete_).toHaveBeenNthCalledWith(1, '/api/v1/sys_FileMeta/res-id')
        expect(api.delete_).toHaveBeenNthCalledWith(2, '/api/v1/mosaic_exp_data/exp-id')
        done()
      })
    })

    it('should thrown an error in case of a invalid resultFileUri', (done) => {
      const experimentId = 'exp-id'
      const invalidUri = ''

      experimentRepository.removeData(experimentId, invalidUri).catch((e:any) => {
        expect(e.message).toMatch('Invalid result file uri.')
        done()
      })
    })
  })
})
