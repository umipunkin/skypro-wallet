<template>
  <div class="login-container">
    <form @submit.prevent="handleSubmit">
      <h2>{{ isSignUp ? 'Регистрация' : 'Вход' }}</h2>

      <input v-if="isSignUp" v-model="name" placeholder="Имя" required autocomplete="name" />

      <input v-model="login" placeholder="Логин" required autocomplete="username" />

      <input
        type="password"
        v-model="password"
        :placeholder="isSignUp ? 'Придумайте пароль' : 'Пароль'"
        required
        :autocomplete="isSignUp ? 'new-password' : 'current-password'"
      />

      <button type="submit" :disabled="authStore.state.value.isLoading">
        {{ isSignUp ? 'Зарегистрироваться' : 'Войти' }}
        <span v-if="authStore.state.value.isLoading">...</span>
      </button>

      <div class="form-footer">
        <p v-if="authStore.state.value.error" class="error">
          {{ formattedError }}
        </p>
      </div>

      <div v-show="!isSignUp" class="modal__form-group">
        <p>Нужно зарегистрироваться?</p>
        <RouterLink to="/signup" class="modal__link" @click="resetForm">
          Регистрируйтесь здесь
        </RouterLink>
      </div>

      <div v-show="isSignUp" class="modal__form-group">
        <p>Уже есть аккаунт?</p>
        <RouterLink to="/signin" class="modal__link" @click="resetForm"> Войдите здесь </RouterLink>
      </div>
    </form>
  </div>
</template>

<script setup>
import { authStore } from '@/store/authStore'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
  isSignUp: {
    type: Boolean,
    required: true,
  },
})

const name = ref('')
const login = ref('')
const password = ref('')

const handleSubmit = async () => {
  try {
    const credentials = {
      login: login.value.trim(),
      password: password.value,
      ...(props.isSignUp && { name: name.value.trim() }),
    }

    if (!credentials.login) {
      authStore.state.value.error = {
        messages: ['Логин обязателен'],
      }
      return
    }

    if (!credentials.password) {
      authStore.state.value.error = {
        messages: ['Пароль обязателен'],
      }
      return
    }

    if (props.isSignUp && !credentials.name) {
      authStore.state.value.error = {
        messages: ['Имя обязательно'],
      }
      return
    }

    try {
      const { success } = props.isSignUp
        ? await authStore.register(credentials)
        : await authStore.login(credentials)

      if (success) {
        await new Promise((resolve) => setTimeout(resolve, 100))
        router.push('/expenses')
        resetForm()
      }
    } catch (error) {
      authStore.state.value.error = {
        messages: [error.message || 'Произошла ошибка'],
      }
      password.value = ''
    }
  } catch (err) {
    console.error('Ошибка при отправке:', err)
    authStore.state.value.error = {
      messages: ['Произошла ошибка при обработке запроса'],
    }
  }
}

const resetForm = () => {
  name.value = ''
  login.value = ''
  password.value = ''
}

const formattedError = computed(() => {
  if (!authStore.state.value.error?.messages) return ''

  return authStore.state.value.error.messages
    .flatMap((msg) => {
      if (typeof msg === 'string') return msg.split('\n')
      return String(msg)
    })
    .filter((msg) => msg.trim())
    .join('<br>')
})
</script>

<style lang="scss" scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #f0f0f0;
  padding: 20px;
}

form {
  width: 380px;
  border: 1px solid #e0e0e0;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  background: white;
  box-sizing: border-box;

  h2 {
    text-align: center;
    margin-bottom: 30px;
    font-size: 24px;
    color: #333;
  }
}

input,
button {
  width: 100%;
  padding: 12px 10px;
  margin-bottom: 18px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

button {
  background-color: #6a11cb;
  color: white;
  border: none;
  margin-bottom: 20px;

  &:hover:not(:disabled) {
    background-color: #4a008f;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.error {
  color: #dc2626;
  background: #fef2f2;
  padding: 8px 12px;
  border-radius: 4px;
  margin: 8px 0;
}

.logo img {
  width: 100px;
  height: auto;
  margin-bottom: 20px;
}

p {
  margin: 10px 0;
}

input:focus {
  outline: 2px solid #6a11cb;
  border-color: transparent;
}

.form-footer {
  text-align: center;
  margin-top: 20px;
}

.modal__form-group {
  text-align: center;
  margin-top: 15px;
}

.modal__form-group p,
.modal__form-group a {
  color: rgba(148, 166, 190, 0.4);
  font-size: 14px;
  font-weight: 400;
  line-height: 150%;
  letter-spacing: -0.14px;
}
.modal__form-group a {
  text-decoration: underline;
}

.modal__link {
  color: #6a11cb;
  text-decoration: none;
  transition: color 0.3s;

  &:hover {
    text-decoration: underline;
    color: #4a008f;
  }
}
@media (max-width: 768px) {
  form {
    width: 90%;
    padding: 15px;
  }
}

@media (max-width: 480px) {
  .login-container {
    padding: 10px;
  }
  input {
    margin-bottom: 12px;
  }
}
</style>
