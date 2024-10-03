<template>
  <nav>
    <router-link to="/"></router-link>
  </nav>
  <router-view />
</template>

<style lang="scss">
body {
    background-color: var(--primary);
    background-image: url('./assets//background.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed;
}
</style>
