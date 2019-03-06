// @ts-ignore
import api from '@molgenis/molgenis-api-client'

const formFields = [{
  id: 'gender',
  type: 'enum'
}, {
  id: 'eventFile',
  type: 'file'
}, {
  id: 'snpFile',
  type: 'file'
}]

const EXP_ENTITY_ID = 'mosaic_exp_data'
const RESULT_FILE_ENTITY_ID = 'sys_FileMeta'
const RESULT_ATTR_ID = 'resultFileId'

const getIdFromUri = (pollUri: string) => pollUri.split('/').pop()

const buildFormData = (data: any, fields: any) => {
  const formData = new FormData()
  Object.entries(data).forEach((pair) => {
    const [key, value] = pair
    const isFile = fields.find((field: any) => {
      return field.id === key && field.type === 'file' && typeof value !==
        'string'
    })

    if (isFile) {
      // @ts-ignore
      formData.append(key, value, value.name)
    } else {
      const stringValue = value === undefined || value === null ? '' : value
      // @ts-ignore
      formData.append(key, stringValue)
    }
  })
  return formData
}

const doPost = (uri: string, formData: any, formFields: any) => {
  const options = {
    headers: {
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    body: buildFormData(formData, formFields),
    method: 'POST',
    credentials: 'same-origin'
  }

  return api.post(uri, options, true).then((result: any) => {
    const createdEntityLocation = result.headers.get('Location')
    return getIdFromUri(createdEntityLocation)
  })
}

const saveExpData = (formData: any) => {
  return doPost('/api/v1/' + EXP_ENTITY_ID + '?_method=PUT', formData, formFields)
}

const saveResultFileId = (experimentId: string, resultFileUri: string) => {
  const options = {
    body: JSON.stringify(getIdFromUri(resultFileUri)),
    method: 'PUT'
  }

  const encodedTableId = encodeURIComponent(EXP_ENTITY_ID)
  const encodedRowId = encodeURIComponent(experimentId)
  const encodedColumnId = encodeURIComponent(RESULT_ATTR_ID)
  return api.post(`/api/v1/${encodedTableId}/${encodedRowId}/${encodedColumnId}`, options)
}

const deleteResultFile = (resultFileId: string) => {
  const resultFile = encodeURIComponent(resultFileId)
  const fileEntity = encodeURIComponent(RESULT_FILE_ENTITY_ID)
  return api.delete_(`/api/v1/${fileEntity}/${resultFile}`)
}

const removeData = (experimentId: string, resultFileUri: string) => {
  const resultFileId = getIdFromUri(resultFileUri)
  if (resultFileId === undefined) {
    return Promise.reject(new Error('Invalid result file uri.'))
  }
  return deleteResultFile(resultFileId).then(() => {
    const encodedTableId = encodeURIComponent(EXP_ENTITY_ID)
    const encodedRowId = encodeURIComponent(experimentId)
    return api.delete_(`/api/v1/${encodedTableId}/${encodedRowId}`)
  })
}

export {
  saveExpData, saveResultFileId, removeData
}
