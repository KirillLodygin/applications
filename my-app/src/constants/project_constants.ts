import { tableHeadersDataType, pageSizeSelectOptionsType } from '@/types/appTypes'

export const authorisation_api = 'https://dev.moydomonline.ru/api/auth/login/'
export const appeals_api = 'https://dev.moydomonline.ru/api/appeals/v1.0/appeals/'
export const premise_api = 'https://dev.moydomonline.ru/api/geo/v2.0/user-premises/'
export const apartments_api = 'https://dev.moydomonline.ru/api/geo/v1.0/apartments/'

export const tableHeadersData: tableHeadersDataType = [
  {
    field: 'number',
    label: '№',
  },
  {
    field: 'created_at',
    label: 'Создана',
  },
  {
    field: 'premise',
    label: 'Адрес',
  },
  {
    field: 'applicant',
    label: 'Заявитель',
  },
  {
    field: 'description',
    label: 'Описание',
  },
  {
    field: 'due_date',
    label: 'Срок',
  },
  {
    field: 'status',
    label: 'Статус',
  },
]

export const pageSizeSelectOptions: pageSizeSelectOptionsType = [
  {
    label: '10',
    value: '10',
  },
  {
    label: '15',
    value: '15',
  },
  {
    label: '20',
    value: '20',
  },
  {
    label: '30',
    value: '30',
  },
]

export const didWindowFields: tableHeadersDataType = [
  {
    field: 'number',
    label: '№',
  },
  {
    field: 'created_at',
    label: 'Создана',
  },
  {
    field: 'address',
    label: 'Дом',
  },
  {
    field: 'apartment',
    label: 'Квартира',
  },
  {
    field: 'due_date',
    label: 'Срок',
  },
  {
    field: 'patronymic_name',
    label: 'Фамилия',
  },
  {
    field: 'first_name',
    label: 'Имя',
  },
  {
    field: 'last_name',
    label: 'Отчество',
  },
  {
    field: 'phone',
    label: 'Телефон',
  },
  {
    field: 'description',
    label: 'Описание',
  },
  {
    field: 'status',
    label: 'Статус',
  },
  {
    field: 'id',
    label: 'id'
  }
]

export const didFormRows = [
  ['number', 'created_at'],
  ['address', 'apartment', 'due_date'],
  ['patronymic_name', 'first_name', 'last_name', 'phone'],
  ['description', 'status'],
]
