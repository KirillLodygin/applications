<template>
  <div>
    <HomePage />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import HomePage from '@/components/HomePage.vue'

@Component({
  components: {
    HomePage,
  },
})
export default class HomePageView extends Vue {}
</script>