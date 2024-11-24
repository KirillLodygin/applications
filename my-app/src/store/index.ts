import Vue from 'vue'
import Vuex from 'vuex'
import { cloneDeep } from 'lodash'
import { formatData, getData, setNewAppealData, updateNewAppealData } from '@/utils/app_utils'
import { tableHeadersData, didWindowFields, apartments_api } from '@/constants/project_constants'
import {
  userType,
  userDataType,
  tableDataType,
  tableDataStringType,
  sortDirectionType,
  addressSelectOptionsType,
  apartmentSelectionOptionsType,
} from '@/types/appTypes'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {} as userType,
    userData: {} as userDataType,
    isLoginNotSuccessful: '' as string,
    applicationsCount: 0 as number,
    pageSize: 10 as number,
    page: 1 as number,
    tableData: [] as tableDataType,
    tableDataFieldsArr: [] as Array<string>,
    sortDirection: 'none' as sortDirectionType,
    sortableField: '' as string,
    paginationStartingPoint: 1 as number,
    paginationEndingPoint: 0 as number,
    paginationLineArr: [] as Array<string>,
    apartmentSelectionOptions: [] as apartmentSelectionOptionsType,
    premiseSelectionOptions: [] as addressSelectOptionsType,
    apartmentsSelectionOptions: [] as addressSelectOptionsType,
    premiseId: '' as string,
    idName: '' as string,
    bidTitle: '' as string,
    isNewDid: false as boolean,
    appealData: {} as tableDataStringType,
    isModalVisible: false as boolean,
    isDidCreating: false as boolean,
    errorDetails: '' as string,
    didTitle: 'Создание заявки' as string,
    newAppealData: {} as tableDataStringType,
  },
  getters: {
    getUser(state) {
      return state.user
    },
    getUserData(state) {
      return state.userData
    },
    getPageSize(state) {
      return `?page_size=${state.pageSize}`
    },
    getPage(state) {
      return `&page=${state.page}`
    },
    getPremiseSelectionOptions(state) {
      return state.premiseSelectionOptions
    },
    getApartmentSelectionOptions(state) {
      return state.apartmentSelectionOptions
    },
    getIdName(state) {
      return `?search=${state.idName}`
    },
    getPremiseId(state) {
      return `?premise_id=${state.premiseId}`
    },
  },
  mutations: {
    createUser(state, newUser: userType) {
      state.user = cloneDeep(newUser)
    },

    createUserData(state, newUserData: userDataType) {
      state.userData = cloneDeep(newUserData)
    },

    onIsLoginNotSuccessful(state, message) {
      state.isLoginNotSuccessful = message
    },

    setSortableField(state, field) {
      if (state.sortableField !== field) {
        state.sortableField = field
        state.sortDirection = 'none'
      }
      if (state.sortDirection === 'desc') {
        state.sortableField = ''
      }
    },

    setPageSize(state, value) {
      state.pageSize = Number(value)
    },

    setPage(state, value) {
      state.page = value
      if (state.page > state.paginationStartingPoint + 4) {
        state.paginationStartingPoint = state.page - 4
      }
      if (state.page === state.paginationEndingPoint) {
        state.paginationStartingPoint = state.page - 5
      }
      if (state.page < state.paginationStartingPoint) {
        state.paginationStartingPoint = state.page
      }
    },

    setPremiseId(state, value) {
      state.premiseId = value
    },

    setIdName(state, value) {
      state.idName = value
    },

    setSortDirection(state) {
      switch (state.sortDirection) {
        case 'none':
          state.sortDirection = 'asc'
          break
        case 'asc':
          state.sortDirection = 'desc'
          break
        default:
          state.sortDirection = 'none'
      }
    },

    async getNewPremiseSelectionOptions(state, requestString) {
      const control = await getData(state.userData.key, requestString)
      if (control.results) {
        state.premiseSelectionOptions = control.results.map((item: Record<string, any>) => {
          return {
            value: item.id,
            label: item.address,
          }
        })
      }
    },

    async getApplicationData(state, requestString) {
      state.tableData = []

      const control = await getData(state.userData.key, requestString)

      state.tableDataFieldsArr = tableHeadersData.map((item) => item.field)
      state.applicationsCount = control.count
      state.paginationEndingPoint = Math.round(state.applicationsCount / state.pageSize)

      state.paginationLineArr = []
      for (let i = state.paginationStartingPoint; i < state.paginationStartingPoint + 5; i++) {
        state.paginationLineArr.push(String(i))
      }
      const lastPoint =
        state.paginationStartingPoint + state.pageSize + 5 < state.paginationEndingPoint
          ? state.paginationStartingPoint + state.pageSize + 5
          : state.paginationEndingPoint

      state.paginationLineArr.push('...')

      state.paginationLineArr.push(String(lastPoint))

      if (!control.results && control.message) {
        state.errorDetails = control.message
      }

      if (control.results) {
        state.tableData = control.results.map((item: Record<string, any>) => {
          const dataObj: tableDataStringType = {}
          state.tableDataFieldsArr.forEach((field) => {
            switch (field) {
              case 'premise':
                const address = item.premise ? item.premise.address : ''
                const apartment = item.apartment ? item.apartment.label : ''
                dataObj[field] = `${address} ${apartment}`
                break

              case 'applicant':
                const last_name = item.applicant ? item.applicant.last_name : ''
                const first_name = item.applicant && item.applicant.first_name ? item.applicant.first_name[0] : ''
                const patronymic_name =
                  item.applicant && item.applicant.patronymic_name ? item.applicant.patronymic_name[0] : ''
                dataObj[field] = `${last_name} ${first_name}${patronymic_name}`
                break

              case 'status':
                const details = item.status ? item.status.full_details : ''
                dataObj[field] = details
                break

              case 'due_date':
                dataObj[field] = formatData(item[field])
                break

              case 'created_at':
                dataObj[field] = formatData(item[field])
                break

              default:
                dataObj[field] = String(item[field])
            }
          })
          return dataObj
        })

        state.premiseSelectionOptions = control.results.map((item: Record<string, any>) => ({
          value: item.premise ? item.premise.id : '',
          label: item.premise ? item.premise.address : '',
        }))

        state.apartmentSelectionOptions = control.results.map((item: Record<string, any>) => ({
          value: item.apartment ? item.apartment.id : '',
          label: item.apartment ? item.apartment.label : '',
        }))
      }
    },

    async getAppealInfo(state, requestString) {
      state.errorDetails = ''
      state.isDidCreating = false
      state.newAppealData = {}
      let control = await getData(state.userData.key, requestString)

      if (!control.results && control.message) {
        state.errorDetails = control.message
      }

      if (!control.results.length) {
        state.errorDetails = 'Данные по вашему запросу не обнаружены!'
      }

      if (control.results && control.results.length) {
        didWindowFields.forEach((item) => {
          switch (item.field) {
            case 'address':
              state.appealData[item.field] =
                control.results[0].premise && control.results[0].premise.address ? control.results[0].premise.id : ''
              break
            case 'apartment':
              state.appealData[item.field] =
                control.results[0].apartment && control.results[0].apartment.label
                  ? control.results[0].apartment.id
                  : ''
              break
            case 'patronymic_name':
              state.appealData[item.field] =
                control.results[0].applicant && control.results[0].applicant.patronymic_name
                  ? control.results[0].applicant.patronymic_name
                  : ''
              break
            case 'first_name':
              state.appealData[item.field] =
                control.results[0].applicant && control.results[0].applicant.first_name
                  ? control.results[0].applicant.first_name
                  : ''
              break
            case 'last_name':
              state.appealData[item.field] =
                control.results[0].applicant && control.results[0].applicant.last_name
                  ? control.results[0].applicant.last_name
                  : ''
              break
            case 'phone':
              state.appealData[item.field] =
                control.results[0].applicant && control.results[0].applicant.phone
                  ? control.results[0].applicant.phone
                  : ''
              break
            case 'due_date':
              state.appealData[item.field] = control.results[0][item.field]
                ? formatData(control.results[0][item.field])
                : ''
              break
            case 'status':
              state.appealData[item.field] =
                control.results[0].status && control.results[0].status.full_details
                  ? control.results[0].status.full_details
                  : ''
              break
            case 'created_at':
              state.appealData[item.field] = formatData(control.results[0][item.field])
              break
            default:
              state.appealData[item.field] = control.results[0][item.field] || ''
          }
        })
        state.didTitle = `Заявка №${state.idName} (от ${state.appealData.due_date})`

        const newRequestString = `${apartments_api}?premise_id=${state.appealData.address}`

        control = await getData(state.userData.key, newRequestString)
        // Должен отметить расхождения в данных. id в поле apartment.id при получении информации о заказе как минимум
        // на трех проверенных объектах среди id в массиве, с номерами квартир, не находится. Здесь все айдишники длинные,
        // типа '2345', а там типа '2', '3', '4'.

        if (!control.results && control.message) {
          state.errorDetails = control.message
          state.isModalVisible = true
        }

        if (control.results) {
          state.apartmentsSelectionOptions = control.results.map((item: Record<string, any>) => {
            return {
              value: item.id,
              label: item.label,
            }
          })
          state.isModalVisible = true
        }
      }
    },

    async getApartmentsInfo(state, requestString) {
      state.isDidCreating = true
      state.errorDetails = ''
      state.newAppealData = {}
      const control = await getData(state.userData.key, requestString)

      if (!control.results && control.message) {
        state.errorDetails = control.message
        state.isModalVisible = true
      }

      if (control.results) {
        state.apartmentsSelectionOptions = control.results.map((item: Record<string, any>) => {
          return {
            value: item.id,
            label: item.label,
          }
        })
        state.isModalVisible = true
      }
    },

    async updateNewAppealData(state, arr) {
      state.newAppealData[arr[0]] = arr[1]

      if (arr[0] === 'address') {
        const newRequestString = `${apartments_api}?premise_id=${arr[1]}`
        const control = await getData(state.userData.key, newRequestString)

        if (!control.results && control.message) {
          state.errorDetails = control.message
        }

        if (control.results) {
          state.apartmentsSelectionOptions = control.results.map((item: Record<string, any>) => {
            return {
              value: item.id,
              label: item.label,
            }
          })
        }
      }
    },

    setIsModalVisible(state, value) {
      state.isModalVisible = value
      if (!value) {
        state.appealData = {}
        state.errorDetails = ''
        state.isDidCreating = false
        state.didTitle = 'Создание заявки'
        state.premiseId = ''
        state.idName = ''
      }
    },

    onDidCreating(state) {
      state.isModalVisible = true
      state.isDidCreating = true
    },

    async setNewPostRequest(state) {
      state.newAppealData.status_id = '1'

      state.errorDetails = await setNewAppealData(state.userData.key, state.newAppealData)
    },

    async setNewPatchRequest(state) {
      if (
        state.newAppealData.address === state.appealData.address &&
        state.newAppealData.apartment === state.appealData.apartment &&
        state.newAppealData.description === state.appealData.description &&
        state.newAppealData.first_name === state.appealData.first_name &&
        state.newAppealData.last_name === state.appealData.last_name &&
        state.newAppealData.patronymic_name === state.appealData.patronymic_name &&
        state.newAppealData.phone === state.appealData.phone
      ) {
        state.errorDetails = 'Не внесено изменений в заявку!'
        return
      }

      state.newAppealData.status_id = '2'
      state.newAppealData.id = state.appealData.id

      state.errorDetails = await updateNewAppealData(state.userData.key, state.newAppealData)
    },

    onCleanErrorDetails(state) {
      state.errorDetails = ''
    }
  },
  actions: {},
  modules: {},
})
