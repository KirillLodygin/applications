<template>
  <div class="dropdown">
    <input type="text" v-model="searchQuery" @keyup="filterOptions(options)" />
    <ul v-if="filteredOptions.length > 0 && searchQuery !== ''">
      <li v-for="(option, index) in filteredOptions" :key="`${option.value}_${index}`" @click="selectOption(option)">
        {{ option.label }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'AutoStoveDropdown',

  props: {
    options: Array,
    componentWidth: String,
  },

  data() {
    return {
      searchQuery: '',
      filteredOptions: [],
    }
  },

  methods: {
    filterOptions(options) {
      this.filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(this.searchQuery.toLowerCase()),
      )
    },
    selectOption(selectedOption) {
      this.searchQuery = selectedOption.label
      this.filteredOptions = []
      this.$emit('onValueSelect', selectedOption.value)
    },
  },
}
</script>

<style scoped>
.dropdown {
  position: relative;
}

.dropdown input {
  border: 0;
  height: auto;
  font-family: Roboto, sans-serif;
  font-size: 14px;
  padding-top: 10px;
  padding-bottom: 10px;
  width: 562px;
  background-color: #ffffff;
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
</style>
