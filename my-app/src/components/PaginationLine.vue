<template>
  <div class="line-wrapp">
    <div class="line-wrapp__range-line">
      <div class="range-line__text">{{ rangeLine }}</div>
      <Select :select-options="pageSizeSelectOptions" @onValueSelect="onValueSelect" />
    </div>

    <PaginationObject />
  </div>
</template>

<script>
import { appeals_api, pageSizeSelectOptions } from '@/constants/project_constants'
import { mapGetters, mapMutations } from 'vuex'
import Select from './Select'
import PaginationObject from './PaginationObject'

export default {
  name: 'PaginationLine',
  components: { Select, PaginationObject },

  data() {
    return {
      pageSizeSelectOptions,
    }
  },

  computed: {
    rangeLine() {
      const rightDigit =
        this.$store.state.pageSize * this.$store.state.page < this.$store.state.applicationsCount
          ? this.$store.state.pageSize * this.$store.state.page
          : this.$store.state.applicationsCount

      const leftDigit = rightDigit - (this.$store.state.pageSize - 1)

      return `${leftDigit}–${rightDigit} из ${this.$store.state.applicationsCount} записей`
    },
  },

  methods: {
    ...mapGetters(['getPageSize', 'getPage']),
    ...mapMutations(['setPageSize', 'getApplicationData', 'setPage']),

    async onValueSelect(selectStatus) {
      this.setPageSize(selectStatus)
      await this.getApplicationData(`${appeals_api}${this.getPageSize()}${this.getPage()}`)
    },
  },
}
</script>

<style scoped>
.line-wrapp {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  height: 40px;
  padding: 0 8px;
  margin-top: 32px;
}

.line-wrapp__range-line {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-family: Roboto, sans-serif;
  font-size: 14px;
  gap: 5px;
}
</style>
