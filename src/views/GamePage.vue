<template>
  <div class="about">
    <main-header></main-header>
    <HomePage></homepage>
  </div>
</template>

<script>
import MainHeader from '@/components/common/Header.vue'
import HomePage from '@/components/homepage/HomePage.vue'
export default {
  name: 'AboutView',
  components: {
    MainHeader,
    HomePage
  }
}
</script>

<style scoped>
</style>
