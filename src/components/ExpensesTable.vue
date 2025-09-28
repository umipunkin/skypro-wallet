<template>
  <div class="table-container">
    <h2 class="table-container__title">Таблица расходов</h2>

    <table>
      <thead>
        <tr>
          <th>Описание</th>
          <th>Категория</th>
          <th>Дата</th>
          <th>Сумма</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="expense in processedExpenses" :key="expense.id">
          <td>{{ expense.description }}</td>
          <td>{{ expense.translatedCategory }}</td>
          <td>{{ expense.formattedDate }}</td>
          <td>{{ expense.amount }} ₽</td>
          <td>
            <img
              src="../assets/icons/bag.svg"
              alt="Удалить"
              class="delete-icon"
              @click="handleDeleteExpense(expense.id)"
            />
          </td>
        </tr>
        <tr v-if="processedExpenses.length === 0">
          <td colspan="5" class="empty-message">Нет данных о расходах</td>
        </tr>
      </tbody>
    </table>
  </div>
  <NewExpenseModal />
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { expensesStore } from '@/store/store.js'
import NewExpenseModal from './NewExpenseModal.vue'

const categoryTranslations = {
  food: 'Еда',
  transport: 'Транспорт',
  housing: 'Жилье',
  joy: 'Развлечения',
  education: 'Образование',
  others: 'Другое',
}

const formatDate = (isoDate) => {
  try {
    const date = new Date(isoDate)
    if (isNaN(date.getTime())) return isoDate

    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  } catch {
    return isoDate
  }
}

const processedExpenses = computed(() => {
  const expenses = expensesStore.state.value || []
  return [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map((expense) => ({
      ...expense,
      amount: expense.amount?.toLocaleString('ru-RU') ?? 0,
      translatedCategory: categoryTranslations[expense.category] || expense.category,
      formattedDate: formatDate(expense.date),
    }))
})

onMounted(() => {
  expensesStore.getExpenses()
})

const handleDeleteExpense = async (id) => {
  if (confirm('Вы уверены, что хотите удалить эту запись?')) {
    try {
      await expensesStore.deleteExpense(id)
    } catch (err) {
      if (err.message === 'Транзакция уже удалена') {
        alert('Эта транзакция уже была удалена')
      } else {
        alert('Произошла ошибка при удалении')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.table-container {
  flex: 1;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 20px;
  overflow-x: auto;

  &__title {
    white-space: nowrap;
  }

  table {
    width: 100%;
    min-width: 379px;
    border-collapse: collapse;

    thead {
      border-bottom: 1px solid #e2e8f0;
    }

    th,
    td {
      padding: 6px 16px;
      vertical-align: middle;
      text-align: left;
      white-space: nowrap;
      font-size: 12px;
    }

    th {
      color: #999999;
      font-weight: 600;
      size: 12px;
    }

    tr:last-child td {
      border-bottom: none;
    }
  }
}

.delete-icon {
  width: 20px;
  height: 20px;
  cursor: pointer;
  transition: opacity 0.3s;
  min-width: 20px;

  &:hover {
    opacity: 0.7;
  }
}

th:last-child,
td:last-child {
  width: 40px;
  text-align: center;
  padding-right: 8px;
}

.empty-message {
  text-align: center;
  color: #718096;
  font-style: italic;
  padding: 20px;
}

@media (max-width: 480px) {
  .table-container {
    padding: 12px;
    border-radius: 8px;

    table {
      th,
      td {
        padding: 10px 12px;
        font-size: 14px;
      }
    }
  }

  .delete-icon {
    width: 24px;
    height: 24px;
  }
}
</style>
