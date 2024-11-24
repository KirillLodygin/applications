<template>
  <div class="wrapp">
    <div class="wrapp__create-button" @click="onCreating">Создать</div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'CreateDidButton',

  methods: {
    ...mapMutations(['onDidCreating']),
    onCreating() {
      this.onDidCreating()
    },
  },
}
</script>

<style scoped>
.wrapp {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 32px;
}

.wrapp__create-button {
  width: 78px;
  height: 26px;
  gap: 4px;
  border-radius: 2px;
  color: #ffffff;
  background-color: #50b053;
  box-sizing: border-box;
  font-family: Roboto, sans-serif;
  font-size: 14px;
  font-weight: 400;
  text-align: center;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 4px 0 #6aae5e40;
}
</style>
