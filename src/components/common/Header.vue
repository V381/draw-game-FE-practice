<template>
  <header class="header">
    <nav>
      <ul class="header__menu">
        <li v-if="!canAccessLiveDraw && !isHomePage">
          <router-link to="/" class="header__link">Home</router-link>
        </li>
        <li v-if="canAccessLiveDraw && !isLiveDrawPage">
          <router-link to="/live-draw" class="header__link">Live Draw</router-link>
        </li>
        <li v-if="!isHistoryPage">
          <router-link to="/history" class="header__link">History</router-link>
        </li>
      </ul>
    </nav>
    <div class="header__player-indicator">
      <div class="header__avatar">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="header__avatar-icon"
        >
          <path
            fill-rule="evenodd"
            d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
      <button @click="logout" class="header__logout-button">Logout</button>
    </div>
  </header>
</template>

<script>
import { getAuth, signOut } from 'firebase/auth'
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'

export default {
  name: 'main-header',
  setup () {
    const router = useRouter()
    const route = useRoute()

    const logout = async () => {
      const auth = getAuth()
      try {
        await signOut(auth)
        sessionStorage.removeItem('betSubmitted')
        sessionStorage.removeItem('selectedNumbers')
        router.push('/')
      } catch (error) {
        console.error('Logout error:', error)
      }
    }

    const canAccessLiveDraw = computed(() => {
      const betSubmitted = sessionStorage.getItem('betSubmitted')
      const selectedNumbers = sessionStorage.getItem('selectedNumbers')
      return betSubmitted === 'true' && selectedNumbers
    })

    const isHomePage = computed(() => route.path === '/')
    const isLiveDrawPage = computed(() => route.path === '/live-draw')
    const isHistoryPage = computed(() => route.path === '/history')

    return {
      logout,
      canAccessLiveDraw,
      isHomePage,
      isLiveDrawPage,
      isHistoryPage
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  background-color: #0A1F62;
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;

  &__menu {
    list-style-type: none;
    padding: 0;
    margin: 0;
    display: flex;
    gap: 20px;

    li {
      a {
        color: white;
        text-decoration: none;
        font-weight: bold;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }

  &__player-indicator {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  &__avatar {
    width: 40px;
    height: 40px;
    background-color: #ffffff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    &-icon {
      width: 30px;
      height: 30px;
      color: #0A1F62;
    }
  }

  &__logout-button {
    background-color: transparent;
    border: 2px solid white;
    color: white;
    padding: 8px 16px;

    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
    transition: background-color 0.3s, color 0.3s;

    &:hover {
      background-color: white;
      color: #0A1F62;
    }
  }
}
</style>
