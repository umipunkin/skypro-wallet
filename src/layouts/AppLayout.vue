<template>
  <div class="layout">
    <HeaderComponent />
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import HeaderComponent from '@/components/HeaderComponent.vue'
import { authStore } from '@/store/authStore'
import { expensesStore } from '@/store/store'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(async () => {
  try {
    await authStore.init()

    if (!authStore.isAuthenticated()) {
      router.push('/signin')
      return
    }

    await expensesStore.getExpenses()
  } catch (error) {
    console.error('Ошибка при инициализации:', error)
    router.push('/signin')
  }
})
</script>

<style lang="scss" scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f0f0f0;
}

.content {
  flex: 1;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 15px;
  }
}

@media (max-width: 992px) {
  .layout {
    background-color: #e0e0e0;
  }
}

@media (max-width: 768px) {
  .layout {
    flex-direction: column;
    align-items: center;
  }

  .content {
    width: 100%;
    max-width: 600px;
  }
}

@media (max-width: 480px) {
  .layout {
    padding: 10px;
  }

  .content {
    padding: 10px;
  }
}
</style>
