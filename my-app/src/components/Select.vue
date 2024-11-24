<template>
  <div class="dropdown">
    <select v-model="selectStatus" @change="onValueSelect">
      <option v-for="(option, index) in selectOptions" :value="option.value" :key="`${option.label}_${index}`">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: "Select",

  props: {
    selectOptions: Array,
  },

  data() {
    return {
      selectStatus: '10',
    }
  },

  methods: {
    onValueSelect() {
      this.$emit('onValueSelect', this.selectStatus)
    }
  }

}
</script>

<style scoped>
select {
  border: 0;
  width: 89px;
  height: auto;
  font-family: Roboto, sans-serif;
  background-color: #ffffff;
  padding-left: 20px;
}

.dropdown {
  border-bottom: 1px solid #CCCCCC;
  padding: 8px 12px 8px 0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 89px;
  gap: 5px;
  background-color: #ffffff;
}
</style>