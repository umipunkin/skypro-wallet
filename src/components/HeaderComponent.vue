<template>
  <header class="header">
    <div class="logo">
      <img src="../assets/logo.svg" alt="Логотип" />
    </div>

    <nav class="desktop-nav">
      <router-link to="/expenses" class="nav-link" :exact-active-class="'active'">
        Мои расходы
      </router-link>
      <router-link to="/analysis" class="nav-link" :exact-active-class="'active'">
        Анализ расходов
      </router-link>
    </nav>

    <button class="menu-toggle" @click="isMenuOpen = !isMenuOpen" aria-label="Меню">
      <svg class="hamburger" viewBox="0 0 24 24">
        <path v-if="!isMenuOpen" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
        <path
          v-else
          d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
        />
      </svg>
    </button>

    <div class="nav-container" :class="{ 'mobile-open': isMenuOpen }">
      <nav class="mobile-nav">
        <router-link
          to="/expenses"
          class="nav-link"
          :exact-active-class="'active'"
          @click="isMenuOpen = false"
        >
          Мои расходы
        </router-link>
        <router-link
          to="/analysis"
          class="nav-link"
          :exact-active-class="'active'"
          @click="isMenuOpen = false"
        >
          Анализ расходов
        </router-link>
      </nav>

      <button class="logout-btn" @click="handleLogout" :disabled="isLoggingOut">
        {{ isLoggingOut ? 'Выход...' : 'Выйти' }}
      </button>
    </div>

    <transition name="fade">
      <div v-if="logoutError" class="error-message">
        {{ logoutError }}
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { authStore } from '@/store/authStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoggingOut = ref(false)
const logoutError = ref(null)
const isMenuOpen = ref(false)

const handleLogout = async () => {
  try {
    isLoggingOut.value = true
    logoutError.value = null

    await authStore.logout()

    router.push('/signin')
  } catch (error) {
    console.error('Ошибка при выходе:', error)
    logoutError.value = 'Не удалось выйти. Попробуйте еще раз.'
    setTimeout(() => {
      logoutError.value = null
    }, 5000)
  } finally {
    isLoggingOut.value = false
  }
}
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: relative;
  gap: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
    gap: 1rem;
    min-width: 100%;
  }
}

.logo {
  flex-shrink: 0;
  z-index: 100;

  img {
    height: 15px;

    @media (max-width: 480px) {
      height: 20px;
    }
  }
}

.desktop-nav {
  display: flex;
  gap: 2rem;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);

  @media (max-width: 768px) {
    display: none;
  }
}

.nav-link {
  color: #333;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 400;
  transition: all 0.2s ease;
  position: relative;

  &:hover:not(.active) {
    color: #6d28d9;
    font-weight: 600;
  }

  &.active {
    color: #6d28d9;
    font-weight: 600;

    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -4px;
      width: 100%;
      height: 2px;
      background: #6d28d9;
    }
  }
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  padding: 8px;
  z-index: 100;

  @media (max-width: 768px) {
    display: block;
  }

  .hamburger {
    width: 32px;
    height: 32px;
    fill: #333;
  }
}

.nav-container {
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: white;
    flex-direction: column;
    justify-content: flex-start;
    gap: 1.5rem;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: 99;
    padding: 70px 1rem 1rem;

    &.mobile-open {
      transform: translateX(0);
    }
  }
}

.mobile-nav {
  display: none;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 1rem;
  }
}

.logout-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #333;
  font-size: 1rem;
  font-weight: 400;
  padding: 0;
  transition: color 0.2s ease;

  @media (max-width: 768px) {
    width: 100%;
    padding: 1rem;
    background: #f8f8f8;
    border-radius: 8px;
    font-size: 1.1rem;
  }

  &:hover:not(:disabled) {
    color: #6d28d9;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.error-message {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 15px;
  background: #ffebee;
  color: #b71c1c;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
