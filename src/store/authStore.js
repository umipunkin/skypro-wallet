import { ref } from 'vue'
import http from '@/api/http'
import router from '@/routes'

const safeLocalStorage = {
  getItem(key) {
    try {
      return localStorage.getItem(key)
    } catch (e) {
      console.error('LocalStorage error:', e)
      return null
    }
  },
  setItem(key, value) {
    try {
      localStorage.setItem(key, value)
    } catch (e) {
      console.error('LocalStorage error:', e)
    }
  },
  removeItem(key) {
    try {
      localStorage.removeItem(key)
    } catch (e) {
      console.error('LocalStorage error:', e)
    }
  },
}

const handleAuthSuccess = (storeState, userData) => {
  const { token, ...user } = userData
  storeState.value.user = user
  storeState.value.token = token

  if (!user || !token) {
    console.error('Неверные данные для сохранения:', userData)
    return
  }

  safeLocalStorage.setItem('user', JSON.stringify(user))
  safeLocalStorage.setItem('token', token)
  http.defaults.headers.common.Authorization = `Bearer ${token}`
}

const validateCredentials = (credentials, isRegister = false) => {
  const errors = []

  if (!credentials.login?.trim()) {
    errors.push('Логин обязателен')
  }

  if (!credentials.password) {
    errors.push('Пароль обязателен')
  } else if (credentials.password.length < 5) {
    errors.push('Пароль должен быть не менее 5 символов')
  }

  if (isRegister && !credentials.name?.trim()) {
    errors.push('Имя обязательно')
  }

  return errors
}

export const authStore = {
  state: ref({
    user: JSON.parse(safeLocalStorage.getItem('user') || 'null'),
    token: safeLocalStorage.getItem('token'),
    isLoading: false,
    error: null,
  }),

  async register(userData) {
    try {
      this.state.value.isLoading = true
      this.state.value.error = null

      const errors = validateCredentials(userData, true)
      if (errors.length > 0) {
        throw new Error(errors.join('\n'))
      }

      const response = await http.post('/user', {
        login: userData.login,
        name: userData.name,
        password: userData.password,
      })

      if (response.status !== 201 || !response.data?.user) {
        throw new Error('Ошибка регистрации')
      }

      handleAuthSuccess(this.state, response.data.user)
      return { success: true }
    } catch (error) {
      this.handleError(error, 'Ошибка регистрации')
      return { success: false }
    } finally {
      this.state.value.isLoading = false
    }
  },

  async login(credentials) {
    try {
      this.state.value.isLoading = true
      this.state.value.error = null

      const errors = validateCredentials(credentials)
      if (errors.length > 0) {
        throw new Error(errors.join('\n'))
      }

      const response = await http.post('/user/login', {
        login: credentials.login,
        password: credentials.password,
      })

      if (response.status !== 201 || !response.data?.user) {
        throw new Error('Ошибка авторизации')
      }

      handleAuthSuccess(this.state, response.data.user)
      return { success: true }
    } catch (error) {
      this.handleError(error, 'Неверный логин или пароль')
      return { success: false }
    } finally {
      this.state.value.isLoading = false
    }
  },

  async isTokenValid() {
    if (!this.state.value.token) return false

    try {
      const response = await http.get('/user/check-token')
      return response.status === 200
    } catch (error) {
      if (error.response?.status === 401) {
        this.logout()
      }
      return false
    }
  },

  handleError(error, defaultMessage) {
    const serverMessage = error.response?.data?.error || error.message
    this.state.value.error = {
      messages: [serverMessage || defaultMessage],
      details: error.response?.data?.errors,
    }
  },

  async logout() {
    try {
      this.state.value.user = null
      this.state.value.token = null
      this.state.value.error = null

      safeLocalStorage.removeItem('user')
      safeLocalStorage.removeItem('token')
      delete http.defaults.headers.common.Authorization

      await router.push({
        path: '/signin',
        query: { logout: true },
        replace: true,
      })
    } catch (error) {
      console.error('Ошибка выхода:', error)
    }
  },

  isAuthenticated() {
    return !!this.state.value.token
  },

  async init() {
    try {
      const token = safeLocalStorage.getItem('token')
      const user = safeLocalStorage.getItem('user')

      if (token) {
        this.state.value.token = token
        http.defaults.headers.common.Authorization = `Bearer ${token}`
      }

      if (user) {
        try {
          this.state.value.user = JSON.parse(user)
        } catch (error) {
          console.error('Ошибка парсинга пользователя:', error)
          safeLocalStorage.removeItem('user')
        }
      }
    } catch (error) {
      console.error('Ошибка инициализации:', error)
      await this.logout()
    }
  },
}
