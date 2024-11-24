<template>
  <div class="pagination-wrap">
    <div class="arrow-cell" @click="goToStart">
      <svg-icon type="mdi" :path="doubleLeftPath" />
    </div>
    <div class="arrow-cell" @click="decreaseCurrentPage">
      <svg-icon type="mdi" :path="chevronLeftPath" />
    </div>
    <div v-for="item in paginationLineArr" :key="item" @click="onSelectPage(item)">
      <div class="pagination-cell" :class="Number(item) === currentPage ? 'current-pagination-cell' : ''">
        {{ item }}
      </div>
    </div>
    <div class="arrow-cell" @click="increaseCurrentPage">
      <svg-icon type="mdi" :path="chevronRightPath" />
    </div>
    <div class="arrow-cell" @click="goToEnd">
      <svg-icon type="mdi" :path="doubleRightPath" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { appeals_api } from '@/constants/project_constants'
import { mdiChevronDoubleLeft } from '@mdi/js'
import { mdiChevronDoubleRight } from '@mdi/js'
import { mdiChevronLeft } from '@mdi/js'
import { mdiChevronRight } from '@mdi/js'

import SvgIcon from '@jamescoyle/vue-icon'

export default {
  name: 'PaginationObject',
  components: { SvgIcon },

  data() {
    return {
      doubleLeftPath: mdiChevronDoubleLeft,
      doubleRightPath: mdiChevronDoubleRight,
      chevronLeftPath: mdiChevronLeft,
      chevronRightPath: mdiChevronRight,
    }
  },

  computed: {
    paginationLineArr() {
      return this.$store.state.paginationLineArr
    },
    currentPage() {
      return this.$store.state.page
    },
    paginationEndingPoint() {
      return this.$store.state.paginationEndingPoint
    },
  },

  methods: {
    ...mapGetters(['getPageSize', 'getPage']),
    ...mapMutations(['getApplicationData', 'setPage']),

    async onSelectPage(value) {
      if (value === '...' || Number(value) === this.currentPage) return
      this.setPage(Number(value))
      await this.getApplicationData(`${appeals_api}${this.getPageSize()}${this.getPage()}`)
    },

    async decreaseCurrentPage() {
      if (this.currentPage === 1) return
      this.setPage(this.currentPage - 1)
      await this.getApplicationData(`${appeals_api}${this.getPageSize()}${this.getPage()}`)
    },

    async goToStart() {
      if (this.currentPage === 1) return
      this.setPage(1)
      await this.getApplicationData(`${appeals_api}${this.getPageSize()}${this.getPage()}`)
    },

    async increaseCurrentPage() {
      if (this.currentPage === this.paginationEndingPoint) return
      this.setPage(this.currentPage + 1)
      await this.getApplicationData(`${appeals_api}${this.getPageSize()}${this.getPage()}`)
    },

    async goToEnd() {
      if (this.currentPage === this.paginationEndingPoint) return
      this.setPage(this.paginationEndingPoint)
      await this.getApplicationData(`${appeals_api}${this.getPageSize()}${this.getPage()}`)
    },
  },
}
</script>

<style scoped>
.pagination-wrap {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-family: Roboto, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 11.72px;
  text-align: center;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
  color: #6c757d;
  gap: 5px;
}

.arrow-cell {
  cursor: pointer;
}

.pagination-cell {
  width: 32px;
  height: 32px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.current-pagination-cell {
  color: #ffffff;
  background-color: #50b053;
}
</style>
