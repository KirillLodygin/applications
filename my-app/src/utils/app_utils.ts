import axios from 'axios'
import { tableDataStringType } from '@/types/appTypes'
import { appeals_api } from '@/constants/project_constants'

export const formatData = (dataString: string) => {
  if (!dataString) return ''
  const fullDataArr = dataString.split('T')
  const data = fullDataArr[0].split('-').reverse().join('.')
  const time = fullDataArr[1].split('.')[0].split(':').slice(0, 2).join(':')
  return `${data} ${time}`
}

export const returnData = (str: string) => {
  if (!str) return ''
  return new Date(str.split(' ')[0].replace(/(\d+).(\d+).(\d+)/, '$3/$2/$1'))
}

export const getData = async (token: string, requestString: string) => {
  return await axios
    .get(requestString, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      return error.response.data.error
    })
}

export const getNewData = (dateString: string) => {
  if (!dateString) return ''
  const [day, month, year, hour, minute] = dateString.split(/[\.\s:]/)
  if (
    !day ||
    day === 'undefined' ||
    !month ||
    month === 'undefined' ||
    !year ||
    year === 'undefined' ||
    !hour ||
    hour === 'undefined' ||
    !minute ||
    minute === 'undefined'
  ) {
    return ''
  }
  const date = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute))
  const timezoneOffsetInMinutes = date.getTimezoneOffset()
  const timezoneSign = timezoneOffsetInMinutes > 0 ? '-' : '+'
  const timezoneHours = Math.abs(Math.floor(timezoneOffsetInMinutes / 60))
  const timezoneMinutes = Math.abs(timezoneOffsetInMinutes % 60)
  const timezone = `${timezoneSign}${timezoneHours.toString().padStart(2, '0')}:${timezoneMinutes.toString().padStart(2, '0')}`
  return date.toISOString().replace('Z', timezone)
}

export const setNewAppealData = async (token: string, data: tableDataStringType) => {
  return await axios
    .post(
      appeals_api,
      {
        premise_id: data.premise_id,
        apartment_id: data.apartment_id,
        applicant: {
          first_name: data.first_name,
          last_name: data.last_name,
          patronymic_name: data.patronymic_name,
          username: data.phone,
        },
        description: data.description,
        due_date: data.due_date,
        status_id: data.status_id,
      },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      },
    )
    .then((res) => {
      return 'Заявка успешно создана'
    })
    .catch((error) => {
      console.log(error.response.data.data)
      return error.response.data.data.status_id[0]
    })
}

export const updateNewAppealData = async (token: string, data: tableDataStringType) => {
  return await axios
    .patch(
      `${appeals_api}${data.id}/`,
      {
        number: data.number,
        created_at: data.created_at,
        premise_id: data.premise_id,
        apartment_id: data.apartment_id,
        applicant: {
          first_name: data.first_name,
          last_name: data.last_name,
          patronymic_name: data.patronymic_name,
          username: data.phone,
        },
        description: data.description,
        due_date: data.due_date,
        status_id: data.status_id,
      },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      },
    )
    .then((res) => {
      return 'Заявка успешно отредактирована'
    })
    .catch((error) => {
      console.log(error.response.data.data.status_id)
      return error.response.data.data.status_id[0]
    })
}
