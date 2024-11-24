<template>
  <div class="wrapper">
    <h1>Список заявок</h1>
    <div class="wrapper__table-wrapp">
      <CreateDidButton />
      <SearchLine />
      <TableBody />
      <PaginationLine />
    </div>
    <DidWindow v-if="isModalVisible || isErrorDetails" @close="closeModal" />
  </div>
</template>

<script>
import { isEmpty } from 'lodash'
import { mapGetters, mapMutations } from 'vuex'
import { appeals_api, premise_api } from '@/constants/project_constants'
import TableBody from './TableBody'
import PaginationLine from './PaginationLine'
import SearchLine from './SearchLine'
import DidWindow from './DidWindow'
import CreateDidButton from './CreateDidButton'

export default {
  name: 'HomePage',
  components: { TableBody, PaginationLine, SearchLine, DidWindow, CreateDidButton },

  methods: {
    ...mapGetters(['getUserData', 'getPageSize', 'getPage']),
    ...mapMutations([
      'getApplicationData',
      'createNewPaginationLineArr',
      'getNewPremiseSelectionOptions',
      'setIsModalVisible',
    ]),

    async closeModal() {
      this.setIsModalVisible(false)
      await this.getApplicationData(`${appeals_api}${this.getPageSize()}${this.getPage()}`)
    },
  },

  computed: {
    isModalVisible() {
      return this.$store.state.isModalVisible
    },
    isErrorDetails() {
      return this.$store.state.errorDetails
    }
  },

  async mounted() {
    const userData = this.getUserData()
    if (isEmpty(userData)) {
      this.$router.push('/login')
      return
    }
    await this.getApplicationData(`${appeals_api}${this.getPageSize()}${this.getPage()}`)
    await this.getNewPremiseSelectionOptions(premise_api)
  },
}
</script>

<style scoped>
.wrapper {
  padding: 25px 15px;
  overflow-x: hidden;
}

h1 {
  font-family: Roboto, sans-serif;
  font-size: 20px;
  font-weight: 400;
  line-height: 24px;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
  margin-bottom: 70px;
  padding-left: 17px;
}

.wrapper__table-wrapp {
  width: 100%;
  height: auto;
  padding: 15px 10px 10px 20px;
  gap: 32px;
  border-radius: 8px;
  background-color: #FFFFFF;
}
</style>
