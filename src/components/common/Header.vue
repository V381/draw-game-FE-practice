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
      <div v-if="user" class="header__avatar">
        <img v-if="isGitHubUser" :src="user.photoURL" :alt="user.displayName" class="header__avatar-img" />
        <svg
          v-else
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
      <span v-if="user" class="header__username">{{ user.displayName }}</span>
      <button @click="logout" class="header__logout-button">Logout</button>
    </div>
  </header>
</template>

<script>
import { getAuth, signOut } from 'firebase/auth'
import { useRouter, useRoute } from 'vue-router'
import { computed, ref, onMounted } from 'vue'

export default {
  name: 'main-header',
  setup () {
    const router = useRouter()
    const route = useRoute()
    const user = ref(null)
    const isGitHubUser = ref(false)

    const logout = async () => {
      const auth = getAuth()
      try {
        await signOut(auth)
        sessionStorage.removeItem('betSubmitted')
        sessionStorage.removeItem('selectedNumbers')
        user.value = null
        isGitHubUser.value = false
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

    onMounted(() => {
      const auth = getAuth()
      auth.onAuthStateChanged((currentUser) => {
        if (currentUser) {
          user.value = currentUser
          isGitHubUser.value = currentUser.providerData.some(provider => provider.providerId === 'github.com')
        } else {
          user.value = null
          isGitHubUser.value = false
        }
      })
    })

    return {
      logout,
      canAccessLiveDraw,
      isHomePage,
      isLiveDrawPage,
      isHistoryPage,
      user,
      isGitHubUser
    }
  }
}
</script>

<style lang="scss" scoped>
.header {
  background-color: var(--bg-primary);
  padding: var(--spacing-md) var(--spacing-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-primary);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  &__menu {
    list-style-type: none;
    padding: 0;
    margin: 0;
    display: flex;
    gap: var(--spacing-md);

    li {
      a {
        color: var(--text-primary);
        text-decoration: none;
        font-weight: bold;
        font-size: var(--font-size-md);
        transition: all var(--transition-default);
        padding: var(--spacing-sm) var(--spacing-md);
        border-radius: var(--border-radius-sm);

        &:hover, &.router-link-active {
          background-color: var(--color-secondary);
          color: var(--bg-primary);
        }
      }
    }
  }

  &__player-indicator {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
  }

  &__avatar {
    width: 40px;
    height: 40px;
    background-color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);

    &-icon {
      width: 30px;
      height: 30px;
      color: var(--bg-primary);
    }

    &-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__username {
    font-weight: bold;
    font-size: var(--font-size-md);
    color: var(--color-secondary);
  }

  &__logout-button {
    background-color: transparent;
    border: 2px solid var(--color-secondary);
    color: var(--color-secondary);
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--border-radius-sm);
    cursor: pointer;
    font-weight: bold;
    font-size: var(--font-size-sm);
    transition: all var(--transition-default);

    &:hover {
      background-color: var(--color-secondary);
      color: var(--bg-primary);
    }
  }
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: var(--spacing-md);

    &__menu {
      width: 100%;
      justify-content: center;
    }

    &__player-indicator {
      width: 100%;
      justify-content: center;
    }
  }
}
</style>
