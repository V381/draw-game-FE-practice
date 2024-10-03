<template>
    <header>
      <nav>
        <ul class="app-menu">
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/live-draw">Live Draw</router-link></li>
        </ul>
      </nav>
      <div class="player-indicator">
        <div class="avatar">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="avatar-icon">
            <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clip-rule="evenodd" />
          </svg>
        </div>
        <button @click="logout" class="logout-button">Logout</button>
      </div>
    </header>
  </template>

<script>
import { getAuth, signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'

export default {
  name: 'main-header',
  setup () {
    const router = useRouter()

    const logout = async () => {
      const auth = getAuth()
      try {
        await signOut(auth)
        router.push('/')
      } catch (error) {
        console.error('Logout error:', error)
      }
    }

    return { logout }
  }
}
</script>

  <style lang="scss" scoped>
  header {
    background-color: #0A1F62;
    padding: 15px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
  }

  .app-menu {
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

  .player-indicator {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .avatar {
    width: 40px;
    height: 40px;
    background-color: #ffffff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    .avatar-icon {
      width: 30px;
      height: 30px;
      color: #0A1F62;
    }
  }

  .logout-button {
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
  </style>
