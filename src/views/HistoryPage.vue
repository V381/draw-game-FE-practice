<template>
    <div class="home">
      <MainHeader></MainHeader>
      <div class="draw-container">
        <History></History>
      </div>
    </div>
  </template>

<script>
import MainHeader from '@/components/common/Header.vue'
import History from '@/components/draw/History.vue'

export default {
  name: 'DrawPageView',
  components: {
    History,
    MainHeader
  }
}
</script>

  <style scoped>
  .home {
    background-image: url('@/assets/background.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed;
  }

  .draw-container {
    background-color: #005baa;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    color: white;
  }
  </style>
