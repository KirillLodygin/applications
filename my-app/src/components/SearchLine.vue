<template>
  <form class="line-wrapp">
    <div class="text-field">
      <div class="text-field__group">
        <input
          v-model="idName"
          class="text-field__input"
          type="text"
          name="idName"
          placeholder="Поиск (№ заявки, название)"
          @keydown="keyOn"
        />
        <button class="text-field__btn" type="button" :disabled="!idName" @click="searchById">
          <svg-icon type="mdi" :path="path"> </svg-icon>
        </button>
      </div>
    </div>

    <div class="text-field__group">
      <label class="text-field__label">Дом</label>
      <AutoStoveDropdown :options="premiseSelectionOptions" @onValueSelect="onValueSelect" />
    </div>
  </form>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiMagnify } from '@mdi/js'
import { appeals_api, apartments_api } from '@/constants/project_constants'

import AutoStoveDropdown from './AutoStoveDropdown'

export default {
  name: 'SearchLine',
  components: { AutoStoveDropdown, SvgIcon },

  computed: {
    premiseSelectionOptions() {
      return this.$store.state.premiseSelectionOptions
    },
  },

  data() {
    return {
      idName: '',
      path: mdiMagnify,
    }
  },

  methods: {
    ...mapGetters(['getIdName', 'getPremiseId', 'getPremiseSelectionOptions']),
    ...mapMutations(['setPremiseId', 'setIdName', 'getAppealInfo', 'getApartmentsInfo']),

    async onValueSelect(selectStatus) {
      this.setPremiseId(selectStatus)
      await this.getApartmentsInfo(`${apartments_api}${this.getPremiseId()}`)
    },

    async searchById() {
      this.setIdName(this.idName)
      await this.getAppealInfo(`${appeals_api}${this.getIdName()}`)
    },

    async keyOn(event) {
      if (event.code === 'Enter') {
        this.setIdName(this.idName)
        await this.getAppealInfo(`${appeals_api}${this.getIdName()}`)
      }
    },
  },
}
</script>

<style scoped>
.line-wrapp {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 0 10px;
  margin-bottom: 10px;
}

.text-field__group {
  border-bottom: 1px solid #cccccc;
  padding: 8px 12px 8px 0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-width: 595px;
  gap: 5px;
}

.text-field__input {
  border: 0;
  width: 562px;
  height: auto;
  font-size: 14px;
  padding-top: 10px;
  padding-bottom: 10px;
  background-color: #ffffff;
}

.text-field__btn {
  background-color: #ffffff;
  border: 0;
  cursor: pointer;
}

.text-field__label {
  font-family: Roboto, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
  color: #999999;
  margin-right: 25px;
  margin-top: 3px;
}
</style>
