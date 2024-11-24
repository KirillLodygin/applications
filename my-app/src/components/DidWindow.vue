<template>
  <transition name="modal-fade">
    <div class="modal-backdrop">
      <div class="modal">
        <header class="modal-header">
          <button type="button" class="btn-close" @click="close">x</button>
        </header>

        <section class="modal-title">
          <h3>{{ !errorDetails ? didTitle : 'Статус заявки' }}</h3>
          <p v-if="!errorDetails">{{ isDidCreating ? 'Новая' : 'Редактируемая' }}</p>
        </section>

        <section class="modal-body">
          <div v-if="isModalVisible && !isDidCreating && isEmpty(appealData) && !errorDetails">
            <vue-simple-spinner
              size="massive"
              line-fg-color="#009900"
              line-bg-color="#555555"
              message="Загрузка данных..."
            />
          </div>
          <div v-else-if="errorDetails" class="content-block">
            {{ errorDetails }}
          </div>
          <div v-else class="content-block">
            <DidForm />
          </div>
        </section>

        <footer class="modal-footer">
          <slot name="footer">
            <button type="button" class="btn-green" @click="passRequest(getCloseTitle)">
              {{ getCloseTitle }}
            </button>
          </slot>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script>
import { isEmpty } from 'lodash'
import VueSimpleSpinner from 'vue-simple-spinner'
import { mapMutations, mapGetters } from 'vuex'

import DidForm from './DidForm'

export default {
  name: 'DidWindow',
  components: { VueSimpleSpinner, DidForm },

  data() {
    return {
      isEmpty,
    }
  },

  computed: {
    didTitle() {
      return this.$store.state.didTitle
    },
    isDidCreating() {
      return this.$store.state.isDidCreating
    },
    errorDetails() {
      return this.$store.state.errorDetails
    },
    appealData() {
      return this.$store.state.appealData
    },
    premiseSelectionOptions() {
      return this.$store.state.premiseSelectionOptions
    },
    apartmentsSelectionOptions() {
      return this.$store.state.apartmentsSelectionOptions
    },
    isModalVisible() {
      return this.$store.state.isModalVisible
    },
    getCloseTitle() {
      if (this.$store.state.errorDetails) {
        return 'Закрыть'
      }
      return this.$store.state.isDidCreating ? 'Создать' : 'Сохранить'
    },
  },

  methods: {
    ...mapMutations(['setNewPostRequest', 'getApplicationData', 'setNewPatchRequest', 'onCleanErrorDetails']),
    ...mapGetters(['getPageSize', 'getPage']),

    close() {
      this.$emit('close')
    },

    async passRequest(title) {
      if (this.$store.state.errorDetails === 'Не внесено изменений в заявку!') {
        this.onCleanErrorDetails()
        return
      }

      if (title === 'Закрыть') {
        this.$emit('close')
        return
      }

      if (title === 'Создать') {
        await this.setNewPostRequest()
        if (isEmpty(this.$store.state.appealData)) {
          this.$emit('close')
        }
        return
      }

      await this.setNewPatchRequest()
      if (isEmpty(this.$store.state.appealData)) {
        this.$emit('close')
      }
    },
  },
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  font-family: Roboto, sans-serif;
  background: #ffffff;
  box-shadow: 2px 2px 20px 1px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 800px;
  height: auto;
  max-height: 620px;
  padding: 0 10px 24px 10px;
  border-radius: 8px;
  overflow-x: hidden;
}

.modal-body {
  position: relative;
  padding: 20px 0;
  width: 750px;
}

.modal-header,
.modal-footer {
  display: flex;
  width: 100%;
}

.modal-header {
  justify-content: flex-end;
  margin-bottom: 0;
}

.modal-footer {
  border-top: 1px solid #eeeeee;
  justify-content: flex-end;
}

.modal-title {
  padding: 0;
  margin-top: 0;
  width: 780px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 25px;
  padding-right: 25px;
}

.modal-title h3 {
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
  color: #333333;
}

.modal-title p {
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
  color: #333333;
}

.btn-close {
  border: none;
  font-size: 20px;
  padding: 5px;
  cursor: pointer;
  font-weight: bold;
  color: #50b053;
  background: transparent;
}

.btn-green {
  width: 87px;
  height: 36px;
  border-radius: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #50b053;
  color: #ffffff;
  font-family: Roboto, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  text-align: center;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
  border: 0;
  box-shadow: 0 4px 4px 0 #6aae5e40;
}

footer {
  padding-top: 30px;
  padding-right: 17px;
}

.modal-fade-enter,
.modal-fade-leave-active {
  opacity: 0;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.5s ease;
}
</style>
