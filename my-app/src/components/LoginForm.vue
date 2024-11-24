<template>
  <div class="background">
    <form>
      <h1>Авторизация</h1>

      <div class="form-block">
        <div class="text-field">
          <label class="text-field__label" for="phone">Логин или Телефон</label>
          <div class="text-field__wrapp">
            <svg-icon type="mdi" :path="phonePath" />
            <phone-mask-input
              v-model="phone"
              autoDetectCountry
              id="phone"
              wrapperClass
              :inputClass="inputClass"
              @input="clearNotSuccessfulMessage"
            />
          </div>
        </div>

        <div class="text-field">
          <div class="text-field__wrapp">
            <svg-icon type="mdi" :path="lockPath"> </svg-icon>
            <input
              v-model="userpass"
              class="text-field__input"
              :type="isShowPass ? 'text' : 'password'"
              id="password"
              name="password"
              minlength="6"
              placeholder="Пароль"
              required
              autocomplete="on"
              @input="clearNotSuccessfulMessage"
              @keydown="keyOn"
            />

            <div class="text-field__eye-icon" @click="onChangeIsShowPass">
              <svg-icon type="mdi" :path="isShowPass ? eyePath : eyeOffPath" />
            </div>
          </div>
        </div>

        <p v-show="isLoginNotSuccessful.length">{{ isLoginNotSuccessful }}</p>

        <button class="text-field__btn" type="button" @click="isAuthorisationRequest">Войти</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios'
import { authorisation_api } from '@/constants/project_constants'
import { mapMutations, mapGetters } from 'vuex'
import { mdiEye } from '@mdi/js'
import { mdiEyeOff } from '@mdi/js'
import { mdiPhone } from '@mdi/js'
import { mdiLock } from '@mdi/js'

import PhoneMaskInput from 'vue-phone-mask-input'
import SvgIcon from '@jamescoyle/vue-icon'

export default {
  name: 'LoginForm',

  components: { PhoneMaskInput, SvgIcon },

  data() {
    return {
      phone: '',
      userpass: '',
      phonePath: mdiPhone,
      eyePath: mdiEye,
      eyeOffPath: mdiEyeOff,
      lockPath: mdiLock,
      isShowPass: false,
      inputClass: '{border: 1px solid rgba(0, 0, 0, 0); outline: none; height: 20px;}',
    }
  },

  computed: {
    isLoginNotSuccessful() {
      return this.$store.state.isLoginNotSuccessful
    },
  },

  methods: {
    ...mapMutations(['createUser', 'createUserData', 'onIsLoginNotSuccessful']),
    ...mapGetters(['getUser']),

    clearNotSuccessfulMessage() {
      this.onIsLoginNotSuccessful('')
    },

    isAuthorisationRequest() {
      if ((!this.phone || this.phone === '+7') && !this.userpass) return
      this.createUser({
        username: this.phone.replace('+', ''),
        password: this.userpass,
      })
      axios
        .post(authorisation_api, this.getUser())
        .then((res) => {
          const userData = res.data
          this.createUserData(userData)
          this.$router.push('/')
        })
        .catch((error) => {
          this.onIsLoginNotSuccessful(error.response.data.data.non_field_errors[0])
        })
    },

    onChangeIsShowPass() {
      this.isShowPass = !this.isShowPass
    },

    keyOn(event) {
      if (event.code === 'Enter') {
        this.isAuthorisationRequest()
      }
    },
  },
}
</script>

<style scoped>
.background {
  background-image: url('@/assets/img/background.jpg');
  height: 100vh;
  width: 100%;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}

form {
  width: 340px;
  min-height: 290px;
  height: auto;
  padding: 60px 20px 20px 20px;
  gap: 28px;
  border-radius: 5px;
  background-color: #ffffff;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
}

.form-block {
  font-family: Roboto, sans-serif;
  width: 300px;
  height: auto;
  gap: 8px;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-block p {
  font-size: 12px;
}

h1 {
  font-family: Inter, sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
  width: 308px;
  height: 56px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  background-color: #44a248;
  color: #ffffff;
  position: absolute;
  top: -40px;
}

.text-field {
  font-family: Roboto, sans-serif;
  width: 300px;
  padding: 0 12px 15px 0;
  gap: 8px;
  border-bottom: 1px solid #cccccc;
  margin-bottom: 20px;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.text-field__input {
  background-color: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0);
  width: 256px;
  height: auto;
}

.text-field__label {
  font-family: Roboto, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  text-align: left;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
  color: #50b053;
  padding-left: 25px;
}

.text-field__wrapp {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 5px;
}

.text-field__btn {
  cursor: pointer;
  width: 110px;
  height: 36px;
  border-radius: 4px;
  color: #ffffff;
  background-color: #50b053;
  font-family: Roboto, sans-serif;
  font-weight: 400;
  line-height: 20px;
  text-align: center;
  text-underline-position: from-font;
  text-decoration-skip-ink: none;
  border: 1px solid rgba(0, 0, 0, 0);
  display: flex;
  justify-content: center;
  align-items: center;
}

.text-field__eye-icon {
  cursor: pointer;
}
</style>
