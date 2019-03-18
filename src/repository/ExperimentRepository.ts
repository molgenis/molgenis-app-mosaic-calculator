// @ts-ignore
import api from '@molgenis/molgenis-api-client'

const EXP_ENTITY_ID = 'mosaic_exp_data'
const RESULT_FILE_ENTITY_ID = 'sys_FileMeta'

const getIdFromUri = (pollUri: string) => pollUri.split('/').pop()

const saveExpData = (expData: any) => {
  const formData = new FormData()
  formData.append('eventFile', expData.eventFile, expData.eventFile.name)
  formData.append('snpFile', expData.snpFile, expData.snpFile.name)
  formData.append('gender', expData.gender)
  const options = {
    headers: {
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    body: formData,
    method: 'POST',
    credentials: 'same-origin'
  }
  const uri = '/api/v1/' + EXP_ENTITY_ID + '?_method=PUT'

  return api.post(uri, options, true).then((result: any) => {
    const createdEntityLocation = result.headers.get('Location')
    return getIdFromUri(createdEntityLocation)
  })
}

const deleteResultFile = (resultFileId: string) => {
  const resultFile = encodeURIComponent(resultFileId)
  const fileEntity = encodeURIComponent(RESULT_FILE_ENTITY_ID)
  return api.delete_(`/api/v1/${fileEntity}/${resultFile}`)
}

const removeData = (experimentId: string, resultFileUri: string) => {
  const resultFileId = getIdFromUri(resultFileUri)

  if (!resultFileId) {
    return Promise.reject(Error('Invalid result file uri.'))
  }
  return deleteResultFile(resultFileId).then(() => {
    const encodedTableId = encodeURIComponent(EXP_ENTITY_ID)
    const encodedRowId = encodeURIComponent(experimentId)
    return api.delete_(`/api/v1/${encodedTableId}/${encodedRowId}`)
  })
}

export {
  saveExpData, removeData
}
