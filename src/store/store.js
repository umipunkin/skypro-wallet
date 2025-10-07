import http from '@/api/http'
import { ref } from 'vue'
import { authStore } from './authStore'

const formatDateForAPI = (dateString) => {
  const date = new Date(dateString)
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${month}-${day}-${year}`
}

const isValidDate = (dateString) => {
  const date = new Date(dateString)
  return !isNaN(date.getTime())
}

const validateExpense = (expense) => {
  const errors = []
  const validCategories = ['food', 'transport', 'housing', 'joy', 'education', 'others']

  if (!expense.description || expense.description.trim().length < 4) {
    errors.push('Описание должно содержать минимум 4 символа')
  }

  if (isNaN(expense.sum) || Number(expense.sum) <= 0) {
    errors.push('Сумма должна быть положительным числом')
  }

  if (!validCategories.includes(expense.category)) {
    errors.push(`Недопустимая категория. Допустимые значения: ${validCategories.join(', ')}`)
  }

  if (!isValidDate(expense.date)) {
    errors.push('Некорректный формат даты')
  }

  return errors
}

export const expensesStore = {
  state: ref([]),

  async getExpenses() {
    try {
      await authStore.init()

      const userId = authStore.state.value.user?._id
      if (!userId) {
        throw new Error('Не определен пользователь')
      }

      const response = await http.get('/transactions', {
        params: { userId },
      })

      this.state.value = response.data.map((expense) => ({
        id: expense._id,
        description: expense.description,
        category: expense.category,
        date: expense.date.split('T')[0],
        amount: expense.sum,
        userId: expense.userId,
      }))
    } catch (error) {
      console.error('Ошибка получения транзакций:', error)
      throw error
    }
  },

  async addExpense(newExpense) {
    try {
      console.log('Добавление расхода:', newExpense)

      const errors = validateExpense(newExpense)
      if (errors.length > 0) {
        throw new Error(errors.join('\n'))
      }

      const requestData = {
        description: newExpense.description.trim(),
        sum: Number(newExpense.sum),
        category: newExpense.category,
        date: formatDateForAPI(newExpense.date),
      }

      console.log('Данные для API:', requestData)

      const response = await http.post('/transactions', requestData)

      if (response.status === 201) {
        console.log('Успешный ответ:', response.data)

        // Обновляем локальное состояние
        if (response.data.transactions) {
          this.state.value = response.data.transactions.map((t) => ({
            id: t._id,
            description: t.description,
            category: t.category,
            date: t.date.split('T')[0],
            amount: t.sum,
          }))
        }
        return true
      }
    } catch (error) {
      console.error('Полная ошибка:', error)
      const errorMessage = error.response?.data?.error || error.message
      console.error('Ошибка добавления:', {
        request: newExpense,
        response: error.response?.data,
        error: errorMessage,
      })
      throw new Error(errorMessage)
    }
  },

  async deleteExpense(id) {
    try {
      const response = await http.delete(`/transactions/${id}`)

      if (response.status === 201) {
        if (response.data && response.data.transactions) {
          this.state.value = response.data.transactions.map((expense) => ({
            id: expense._id,
            description: expense.description,
            category: expense.category,
            date: expense.date.split('T')[0],
            amount: expense.sum,
          }))
        } else {
          await this.getExpenses()
        }
      }
    } catch (error) {
      if (error.response?.status === 400) {
        throw new Error('Транзакция уже удалена')
      }
      throw error
    }
  },

  async getPeriodExpenses(startDate, endDate) {
    try {
      if (!isValidDate(startDate) || !isValidDate(endDate)) {
        throw new Error('Некорректный формат дат')
      }

      const requestBody = {
        start: formatDateForAPI(startDate),
        end: formatDateForAPI(endDate),
      }

      const response = await http.post('/transactions/period', requestBody)

      if (response.status === 200) {
        const newData = response.data.map((transaction) => ({
          id: transaction._id,
          description: transaction.description,
          category: transaction.category,
          date: new Date(transaction.date),
          amount: transaction.sum,
          userId: transaction.userId,
        }))

        if (JSON.stringify(newData) !== JSON.stringify(this.state.value)) {
          this.state.value = newData
        }

        return this.state.value
      }
    } catch (error) {
      console.error('Ошибка получения транзакций за период:', {
        dates: { startDate, endDate },
        error: error.response?.data || error.message,
      })
      throw error
    }
  },
}
