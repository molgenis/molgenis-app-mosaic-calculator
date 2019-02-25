// @ts-ignore
import api from '@molgenis/molgenis-api-client'

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

  return api.post(uri, options, true)
}

const save = (formData: any, formFields: any) => {
  const entityId = 'mosaic_exp_data'
  return doPost('/api/v1/' + entityId + '?_method=PUT', formData, formFields)
}

export {
  save
}
