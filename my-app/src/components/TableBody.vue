<template>
  <div class="content">
    <table v-if="tableData.length" class="data-table">
      <thead id="_columns">
        <tr :class="{ 'data-table__row_loading': !tableData.length }">
          <th v-for="cell in tableHeadersData" :key="cell.field" @click="onColumnClick(cell.field)">
            <div class="data-table__cell-content">
              <div>{{ cell.label }}</div>
              <div v-if="['number', 'created_at'].includes(cell.field)">
                <div v-if="sortableField === cell.field" class="active-arrow-cell">
                  <svg-icon type="mdi" :path="sortDirection !== 'desc' ? arrowUpPath : arrowDownPath" />
                </div>
                <div v-else class="arrow-cell">
                  <svg-icon type="mdi" :path="arrowUpPath" />
                </div>
              </div>
            </div>
          </th>
        </tr>
      </thead>

      <tbody id="_body">
        <tr v-for="(obj, index) in tableData" :key="index">
          <td
            v-for="cell in tableHeadersData"
            :key="`${cell.field}_${index}`"
            @click="onCellClick(cell.field, obj[cell.field])"
          >
            <div v-if="cell.field === 'number'" class="number-block">{{ obj[cell.field] }}</div>
            <div v-else>{{ obj[cell.field] }}</div>
          </td>
        </tr>
      </tbody>
    </table>
    <vue-simple-spinner
      v-else
      size="massive"
      line-fg-color="#009900"
      line-bg-color="#555555"
      message="Загрузка данных..."
    />
  </div>
</template>

<script>
import { tableHeadersData, appeals_api } from '@/constants/project_constants'
import { returnData } from '@/utils/app_utils'
import { mapMutations, mapGetters } from 'vuex'
import { mdiArrowDown } from '@mdi/js'
import { mdiArrowUp } from '@mdi/js'

import SvgIcon from '@jamescoyle/vue-icon'
import VueSimpleSpinner from 'vue-simple-spinner'

export default {
  name: 'TableBody',
  components: { SvgIcon, VueSimpleSpinner },

  data() {
    return {
      tableHeadersData,
      arrowDownPath: mdiArrowDown,
      arrowUpPath: mdiArrowUp,
    }
  },

  computed: {
    tableData() {
      if (!this.$store.state.sortableField) {
        return this.$store.state.tableData
      }

      return this.$store.state.tableData.sort((a, b) => {
        const first =
          this.$store.state.sortableField === 'created_at'
            ? returnData(a[this.$store.state.sortableField])
            : a[this.$store.state.sortableField]
        const second =
          this.$store.state.sortableField === 'created_at'
            ? returnData(b[this.$store.state.sortableField])
            : b[this.$store.state.sortableField]

        if (this.$store.state.sortDirection === 'asc') {
          return first - second
        }

        return second - first
      })
    },

    sortDirection() {
      return this.$store.state.sortDirection
    },

    sortableField() {
      return this.$store.state.sortableField
    },
  },

  methods: {
    ...mapMutations([
      'setSortableField',
      'setSortDirection',
      'setIdName',
      'getAppealInfo',
      'setIsModalVisible',
    ]),
    ...mapGetters(['getIdName']),

    onColumnClick(field) {
      if (!['number', 'created_at'].includes(field)) {
        return
      }
      this.setSortableField(field)
      this.setSortDirection()
    },

    onCellClick(field, value) {
      if (field !== 'number') return
      this.setIdName(value)
      this.getAppealInfo(`${appeals_api}${this.getIdName()}`)
    },
  },
}
</script>

<style scoped>
thead {
  vertical-align: top;
  position: sticky;
  top: 0;
  color: #50b053;
  background-color: #ffffff;
}

tbody {
  font-size: 12px;
  text-align: left;
}

.content {
  height: 550px;
  overflow-y: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.data-table {
  font-family: Inter, sans-serif;
  border-collapse: collapse;
  width: 100%;
  min-width: 920px;
}

.data-table td,
.data-table th {
  border-bottom: 1px solid #ddd;
  padding: 10px 8px 10px 8px;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
}

.data-table tbody tr:hover {
  background-color: #ddd;
}

.data-table th {
  padding-top: 12px;
  padding-bottom: 12px;
}

.data-table__row_loading {
  opacity: 0.5;
}

.data-datatable__progress td {
  padding: 0;
  position: relative;
  border: none;
}

.data-datatable__progress .progress-bar {
  position: absolute;
  left: 0;
  bottom: 0;
}

.data-table__cell-content {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 5px;
}

.active-arrow-cell {
  color: #333333;
}

.arrow-cell {
  color: #cccccc;
}

.number-block {
  color: #ffffff;
  background-color: #50b053;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 28px;
  border-radius: 4px;
  cursor: pointer;
}
</style>
