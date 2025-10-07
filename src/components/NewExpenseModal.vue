<template>
  <div class="new-expense-modal">
    <h2>Новый расход</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>Описание:</label>
        <input
          v-model="formData.description"
          type="text"
          placeholder="Введите описание"
          required
          :class="{
            invalid: errors.description,
          }"
          @blur="validateField('description')"
        />
      </div>

      <div class="form-group">
        <label>Категория:</label>
        <div class="category-grid">
          <div
            v-for="category in categories"
            :key="category.name"
            class="category-card"
            :class="{ active: formData.category === category.name }"
            @click="formData.category = category.name"
          >
            <img :src="getIconPath(category.icon)" :alt="category.name" class="category-icon" />
            <span class="category-name">{{ category.name }}</span>
          </div>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Дата:</label>
          <input
            v-model="formData.date"
            type="date"
            required
            :class="{ invalid: errors.date }"
            @blur="validateField('date')"
            :max="getTodayDate()"
          />
        </div>

        <div class="form-group">
          <label>Сумма:</label>
          <input
            v-model.number="formData.amount"
            type="number"
            min="1"
            placeholder="Введите сумму"
            required
            :class="{ invalid: errors.amount }"
            @blur="validateField('amount')"
          />
        </div>
      </div>

      <p v-if="error" class="error">{{ error }}</p>

      <button type="submit" class="submit-button" :disabled="isSubmitting">
        {{ isSubmitting ? 'Добавление...' : 'Добавить новый расход' }}
      </button>

      <p v-if="successMessage" class="success">{{ successMessage }}</p>
    </form>
  </div>
</template>

<script setup>
import { expensesStore } from '@/store/store'
import { ref, onMounted } from 'vue'

const formData = ref({
  description: '',
  category: 'Еда',
  date: '',
  amount: null,
})
const error = ref('')
const successMessage = ref('')
const isSubmitting = ref(false)

const errors = ref({
  description: false,
  date: false,
  amount: false,
})

const categories = [
  { name: 'Еда', icon: 'bag' },
  { name: 'Транспорт', icon: 'car' },
  { name: 'Жилье', icon: 'house' },
  { name: 'Развлечения', icon: 'gameboy' },
  { name: 'Образование', icon: 'teacher' },
  { name: 'Другое', icon: 'message-text' },
]

const categoryMapping = {
  Еда: 'food',
  Транспорт: 'transport',
  Жилье: 'housing',
  Развлечения: 'joy',
  Образование: 'education',
  Другое: 'others',
}

const getIconPath = (iconName) => {
  return `/src/assets/icons/${iconName}.svg`
}

const getTodayDate = () => {
  const today = new Date()
  return today.toISOString().split('T')[0]
}

onMounted(() => {
  formData.value.date = getTodayDate()
})

const validateField = (field) => {
  switch (field) {
    case 'description':
      const descValue = formData.value.description.trim()
      errors.value.description = !descValue || descValue.length < 4
      break

    case 'amount':
      const amountValue = formData.value.amount
      errors.value.amount = !amountValue || amountValue <= 0 || isNaN(amountValue)
      break

    case 'date':
      errors.value.date = !formData.value.date
      break
  }
}

const validateForm = () => {
  validateField('description')
  validateField('amount')
  validateField('date')

  return Object.values(errors.value).every((error) => !error)
}

const handleSubmit = async () => {
  try {
    error.value = ''
    successMessage.value = ''

    if (!validateForm()) {
      error.value = 'Пожалуйста, заполните все обязательные поля корректно'
      return
    }

    isSubmitting.value = true

    const expenseData = {
      description: formData.value.description.trim(),
      category: categoryMapping[formData.value.category],
      date: formData.value.date,
      sum: Number(formData.value.amount),
    }

    console.log('Отправка данных:', expenseData)

    await expensesStore.addExpense(expenseData)

    successMessage.value = 'Расход успешно добавлен!'

    setTimeout(() => {
      resetForm()
      successMessage.value = ''
    }, 2000)
  } catch (err) {
    console.error('Ошибка при добавлении расхода:', err)

    if (err.response && err.response.data) {
      error.value = err.response.data.error || err.response.data.message || 'Произошла ошибка'
    } else {
      error.value = err.message || 'Произошла ошибка при сохранении расхода'
    }
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  formData.value = {
    description: '',
    category: 'Еда',
    date: getTodayDate(),
    amount: null,
  }

  errors.value = {
    description: false,
    date: false,
    amount: false,
  }
}
</script>

<style lang="scss" scoped>
.new-expense-modal {
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  max-width: 500px;
  width: 379px;

  h2 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 24px;
    color: #222222;
    text-align: center;
  }
}

.form-group {
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 8px;
    font-size: 16px;
    color: #666666;
    font-weight: 500;
  }

  input {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-size: 12px;
    transition: all 0.2s;

    &:focus {
      border-color: #6366f1;
      outline: none;
      box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
    }

    &.invalid {
      border-color: #dc2626;
      background: #fef2f2;
    }
  }
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.category-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #cbd5e0;
    background: #edf2f7;
  }

  &.active {
    background: rgba(115, 52, 234, 0.1);
    border-color: #7334ea;

    .category-icon,
    .category-name {
      color: #7334ea;
    }
  }
}

.category-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.category-name {
  font-size: 14px;
  font-weight: 500;
  color: #4a5568;
}

.form-row {
  gap: 24px;
}

.submit-button {
  width: 100%;
  padding: 12px 20px;
  background: #7334ea;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 16px;

  &:hover:not(:disabled) {
    background: #5a2dbb;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: #9ca3af;
  }
}

.error {
  color: #dc2626;
  background: #fef2f2;
  padding: 12px;
  border-radius: 6px;
  margin: 16px 0;
  border-left: 4px solid #dc2626;
}

.success {
  color: #059669;
  background: #f0fdf4;
  padding: 12px;
  border-radius: 6px;
  margin: 16px 0;
  border-left: 4px solid #059669;
  text-align: center;
}

@media (max-width: 480px) {
  .new-expense-modal {
    width: 100%;
    padding: 16px;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .category-grid {
    grid-template-columns: 1fr;
  }
}
</style>
