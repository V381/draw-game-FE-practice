<template>
  <div class="home">
    <Main />
  </div>
</template>

<script>
import Main from '@/components/auth/Main.vue'

export default {
  name: 'LoginFormView',
  components: {
    Main
  }
}
</script>

<style>
  .home {
    background-image: url('../assets/background.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;

  }
</style>
