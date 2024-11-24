<template>
  <form>
    <section v-for="(row, number) in didFormRows" :key="number" class="row-wrap">
      <div v-for="field in row" class="row-wrap__container">
        <div v-if="field === 'address'" class="text-field__group">
          <div class="dropdown">
            <div class="text-field text-field_floating-3">
              <input
                v-model="addressSearchQuery"
                class="text-field__input"
                type="text"
                id="address"
                name="address"
                placeholder="Дом"
                @keyup="addressFilterOptions(premiseSelectionOptions)"
              />
              <label class="text-field__label" for="address">Дом</label>
            </div>

            <ul v-if="addressFilteredOptions.length > 0 && addressSearchQuery !== ''">
              <li
                v-for="(option, index) in addressFilteredOptions"
                :key="`${option.value}_${index}`"
                @click="addressSelectOption(option)"
              >
                {{ option.label }}
              </li>
            </ul>
          </div>
        </div>

        <div v-if="field === 'apartment'" class="text-field__group">
          <div class="dropdown">
            <div class="text-field text-field_floating-3">
              <input
                v-model="apartmentSearchQuery"
                class="text-field__input"
                type="text"
                id="apartment"
                name="apartment"
                placeholder="Квартира"
                @keyup="apartmentFilterOptions(apartmentsSelectionOptions)"
              />
              <label class="text-field__label" for="apartment">Квартира</label>
            </div>
            <ul v-if="apartmentFilteredOptions.length > 0 && apartmentSearchQuery !== ''">
              <li
                v-for="(option, index) in apartmentFilteredOptions"
                :key="`${option.value}_${index}`"
                @click="apartmentSelectOption(option)"
              >
                {{ option.label }}
              </li>
            </ul>
          </div>
        </div>

        <div v-if="field === 'due_date'" class="text-field__group text-field text-field_floating-3">
          <input
            v-model="dueDate"
            class="text-field__input"
            type="text"
            id="dueDate"
            name="dueDate"
            placeholder="Срок"
            @keyup="setNewDueDate"
          />
          <label class="text-field__label" for="dueDate">Срок</label>
        </div>

        <div v-if="field === 'patronymic_name'" class="text-field__group text-field text-field_floating-3">
          <input
            v-model="lastName"
            class="text-field__input"
            type="text"
            id="patronymicName"
            name="patronymicName"
            placeholder="Фамилия"
            @keyup="setNewLastName"
          />
          <label class="text-field__label" for="patronymicName">Фамилия</label>
        </div>

        <div v-if="field === 'first_name'" class="text-field__group text-field text-field_floating-3">
          <input
            v-model="firstName"
            class="text-field__input"
            type="text"
            id="firstName"
            name="firstName"
            placeholder="Имя"
            @keyup="setNewFirstName"
          />
          <label class="text-field__label" for="firstName">Имя</label>
        </div>

        <div v-if="field === 'last_name'" class="text-field__group text-field text-field_floating-3">
          <input
            v-model="patronymicName"
            class="text-field__input"
            type="text"
            id="lastName"
            name="lastName"
            placeholder="Отчество"
            @keyup="setNewPatronymicName"
          />
          <label class="text-field__label" for="dueDate">Отчество</label>
        </div>

        <div v-if="field === 'description'" class="text-field__group text-field text-field_floating-3">
          <input
            v-model="description"
            class="text-field__input"
            type="text"
            id="description"
            name="description"
            placeholder="Описание"
            @keyup="setNewDescription"
          />
          <label class="text-field__label" for="description">Описание</label>
        </div>

        <div v-if="field === 'phone'" class="text-field__group text-field text-field_floating-3">
          <input
            v-model="phone"
            class="text-field__input"
            type="text"
            id="phone"
            name="phone"
            placeholder="Телефон"
            @keyup="setNewPhone"
          />
          <label class="text-field__label" for="phone">Телефон</label>
        </div>

        <div v-if="field === 'status' && !isDidCreating" class="text-field__group text-field text-field_floating-3">
          <input
            v-model="didStatus"
            class="text-field__input"
            type="text"
            id="didStatus"
            name="didStatus"
            placeholder="Статус"
            disabled
          />
          <label class="text-field__label" for="didStatus">Статус</label>
        </div>

        <div v-if="field === 'created_at' && !isDidCreating" class="text-field__group text-field text-field_floating-3">
          <input
            v-model="createdAt"
            class="text-field__input"
            type="text"
            id="createdAt"
            name="createdAt"
            placeholder="Создана"
            disabled
          />
          <label class="text-field__label" for="createdAt">Создана</label>
        </div>

        <div v-if="field === 'number' && !isDidCreating" class="text-field__group text-field text-field_floating-3">
          <input
            v-model="number"
            class="text-field__input"
            type="text"
            id="number"
            name="number"
            placeholder="№"
            disabled
          />
          <label class="text-field__label" for="number">№</label>
        </div>
      </div>
    </section>
  </form>
</template>

<script>
import { mapMutations } from 'vuex'
import { didFormRows } from '@/constants/project_constants'
import { getNewData } from '@/utils/app_utils'

export default {
  name: 'DidForm',

  data() {
    return {
      didFormRows,
      newAppealData: {},
      addressSearchQuery: '',
      addressFilteredOptions: [],
      apartmentSearchQuery: '',
      apartmentFilteredOptions: [],
      dueDate: '',
      patronymicName: '',
      firstName: '',
      lastName: '',
      description: '',
      phone: '',
      didStatus: '',
      createdAt: '',
      number: '',
    }
  },

  mounted() {
    const addressId = this.$store.state.appealData.address
      ? this.$store.state.appealData.address
      : this.$store.state.premiseId

    this.addressSearchQuery = this.$store.state.premiseSelectionOptions.filter((item) => item.value === addressId)[0]
      ? this.$store.state.premiseSelectionOptions.filter((item) => item.value === addressId)[0].label
      : ''
    this.updateNewAppealData(['address', addressId])

    this.apartmentSearchQuery = this.$store.state.apartmentsSelectionOptions.filter(
      (item) => item.value === this.$store.state.appealData.apartment,
    )[0]
      ? this.$store.state.apartmentsSelectionOptions.filter(
          (item) => item.value === this.$store.state.appealData.apartment,
        )[0].label
      : ''
    this.updateNewAppealData(['apartment', this.$store.state.appealData.apartment])

    this.dueDate = this.$store.state.appealData.due_date ? this.$store.state.appealData.due_date : ''
    this.updateNewAppealData(['due_date', getNewData(this.dueDate)])
    this.patronymicName = this.$store.state.appealData.patronymic_name
      ? this.$store.state.appealData.patronymic_name
      : ''
    this.updateNewAppealData(['patronymic_name', this.patronymicName])
    this.firstName = this.$store.state.appealData.first_name ? this.$store.state.appealData.first_name : ''
    this.updateNewAppealData(['first_name', this.firstName])
    this.lastName = this.$store.state.appealData.last_name ? this.$store.state.appealData.last_name : ''
    this.updateNewAppealData(['last_name', this.lastName])
    this.description = this.$store.state.appealData.description ? this.$store.state.appealData.description : ''
    this.updateNewAppealData(['description', this.description])
    this.phone = this.$store.state.appealData.phone ? this.$store.state.appealData.phone : ''
    this.updateNewAppealData(['phone', this.phone])
    this.didStatus = this.$store.state.appealData.status ? this.$store.state.appealData.status : ''
    this.updateNewAppealData(['status', this.didStatus])
    this.number = this.$store.state.appealData.number ? this.$store.state.appealData.number : ''
    this.updateNewAppealData(['number', this.number])
    this.createdAt = this.$store.state.appealData.created_at ? this.$store.state.appealData.created_at : ''
    this.updateNewAppealData(['created_at', getNewData(this.createdAt)])
  },

  computed: {
    premiseSelectionOptions() {
      return this.$store.state.premiseSelectionOptions
    },
    apartmentsSelectionOptions() {
      return this.$store.state.apartmentsSelectionOptions
    },
    isDidCreating() {
      return this.$store.state.isDidCreating
    },
  },

  methods: {
    ...mapMutations(['updateNewAppealData']),

    addressFilterOptions(options) {
      this.addressFilteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(this.addressSearchQuery.toLowerCase()),
      )
    },
    addressSelectOption(selectedOption) {
      this.addressSearchQuery = selectedOption.label
      this.addressFilteredOptions = []
      this.updateNewAppealData(['address', selectedOption.value])
    },

    apartmentSelectOption(selectedOption) {
      this.apartmentSearchQuery = selectedOption.label
      this.apartmentFilteredOptions = []
      this.updateNewAppealData(['apartment', selectedOption.value])
    },

    apartmentFilterOptions(options) {
      this.apartmentFilteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(this.apartmentSearchQuery.toLowerCase()),
      )
    },

    setNewDueDate() {
      this.updateNewAppealData(['due_date', getNewData(this.dueDate)])
    },

    setNewPatronymicName() {
      this.updateNewAppealData(['patronymic_name', this.patronymicName])
    },

    setNewFirstName() {
      this.updateNewAppealData(['first_name', this.firstName])
    },

    setNewLastName() {
      this.updateNewAppealData(['last_name', this.lastName])
    },

    setNewDescription() {
      this.updateNewAppealData(['description', this.description])
    },

    setNewPhone() {
      this.updateNewAppealData(['phone', this.phone])
    },
  },
}
</script>

<style scoped>
form {
  font-family: Roboto, sans-serif;
}
.row-wrap {
  width: 700px;
  margin-bottom: 35px;
  padding: 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
}

.row-wrap__container {
  text-align: left;
  flex: 1;
}

.text-field {
  margin-bottom: 8px;
}

.text-field__group {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
}

.dropdown {
  position: relative;
}

.dropdown ul {
  list-style-type: none;
  margin-top: 5px;
  padding-left: 0;
  background-color: #ffffff;
  border: 1px solid #ccc;
  max-height: 150px;
  overflow-y: auto;
  position: absolute;
  z-index: 100;
  width: 100%;
}

.dropdown li {
  padding: 8px 5px;
  cursor: pointer;
  text-align: left;
  font-family: Roboto, sans-serif;
  font-size: 14px;
}

.dropdown li:hover {
  background-color: #f2f2f2;
}

.text-field__label {
  display: block;
  margin-bottom: 8px;
}

.text-field__input {
  display: block;
  width: 100%;
  height: 56px;
  padding: 8px 2px;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  color: #333333;
  background-color: #fff;
  background-clip: padding-box;
  transition:
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.text-field__input[type='search']::-webkit-search-decoration,
.text-field__input[type='search']::-webkit-search-cancel-button,
.text-field__input[type='search']::-webkit-search-results-button,
.text-field__input[type='search']::-webkit-search-results-decoration {
  -webkit-appearance: none;
}

.text-field__input::placeholder {
  color: #212529;
  opacity: 0.4;
}

.text-field__input:focus {
  color: #212529;
  background-color: #fff;
  border-color: #bdbdbd;
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(158, 158, 158, 0.25);
}

.text-field__input:disabled,
.text-field__input[readonly] {
  background-color: #f5f5f5;
  opacity: 1;
}

.text-field_floating-3 {
  position: relative;
}

.text-field_floating-3 .text-field__input {
  border: none;
  border-bottom: 1px solid #bdbdbd;
  border-radius: 0;
  height: 56px;
  line-height: 1.25;
  padding: 8px 2px;
  background-color: #fff;
  width: 100%;
}

.text-field_floating-3 .text-field__input:focus {
  outline: 0;
  border-bottom: 1px solid #50b053;
  box-shadow: none;
  background-color: #eee;
}

.text-field_floating-3 .text-field__label {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  padding: 1rem 0.75rem;
  pointer-events: none;
  border: 1px solid transparent;
  transform-origin: 0 0;
  transition:
    color 0.15s ease-in-out,
    transform 0.15s ease-in-out;
}

.text-field_floating-3 .text-field__input::-moz-placeholder {
  color: transparent;
}

.text-field_floating-3 .text-field__input::placeholder {
  color: transparent;
}

.text-field_floating-3 .text-field__input:focus,
.text-field_floating-3 .text-field__input:not(:placeholder-shown) {
  padding-top: 1.625rem;
  padding-bottom: 0.625rem;
  border-bottom: 1px solid #50b053;
}

.text-field_floating-3 .text-field__input:focus ~ .text-field__label,
.text-field_floating-3 .text-field__input:not(:placeholder-shown) ~ .text-field__label {
  transform: scale(0.85) translateY(-0.75rem) translateX(0.15rem);
  color: #50b053;
}
</style>
