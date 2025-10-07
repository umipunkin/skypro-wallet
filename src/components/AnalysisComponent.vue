<template>
  <div class="container">
    <h1>Анализ расходов</h1>
    <div class="content-wrapper">
      <CalendarComponent @date-selected="logDates" />

      <ChartComponent
        :expenses="chartReadyData"
        :is-loading="isLoading"
        :start-date="formattedStartDate"
        :end-date="formattedEndDate"
      />
    </div>
    <div v-if="selectedStartDate" class="period-info">
      <template v-if="isSingleDay">
        {{ formattedStartDate }}
      </template>
      <template v-else>
        {{ formattedStartDate }} — {{ formattedEndDate }}
        <span class="days-count">({{ periodDays }} дней)</span>
      </template>
    </div>
    <div v-if="errorMessage" class="error-status">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { expensesStore } from '@/store/store'
import CalendarComponent from './CalendarComponent.vue'
import ChartComponent from './ChartComponent.vue'

const selectedStartDate = ref(null)
const selectedEndDate = ref(null)
const isLoading = ref(false)
const errorMessage = ref(null)
const chartReadyData = ref([])

const hasSelectedPeriod = computed(() => !!selectedStartDate.value && !!selectedEndDate.value)

const isSingleDay = computed(
  () => selectedStartDate.value?.getTime() === selectedEndDate.value?.getTime(),
)

const periodDays = computed(() => {
  if (!selectedStartDate.value || !selectedEndDate.value) return 0
  const diff = selectedEndDate.value - selectedStartDate.value
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1
})

const logDates = (start, end) => {
  selectedStartDate.value = start
  selectedEndDate.value = end
}

const loadExpenses = async () => {
  try {
    if (!hasSelectedPeriod.value || isLoading.value) return

    isLoading.value = true
    chartReadyData.value = []

    const result = await expensesStore.getPeriodExpenses(
      selectedStartDate.value,
      selectedEndDate.value,
    )

    chartReadyData.value = result.filter((e) => e?.category && typeof e.amount === 'number')
  } catch (error) {
    handleError('Ошибка загрузки', error)
  } finally {
    isLoading.value = false
  }
}

const handleError = (context, error) => {
  const errorDetails = {
    message: error.message,
    response: error.response?.data,
    period: {
      start: selectedStartDate.value,
      end: selectedEndDate.value,
    },
  }

  console.error(context, errorDetails)
  errorMessage.value = errorDetails.message
}

const formattedStartDate = computed(
  () =>
    selectedStartDate.value?.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
    }) || '',
)

const formattedEndDate = computed(
  () =>
    selectedEndDate.value?.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
    }) || '',
)

watch([selectedStartDate, selectedEndDate], ([newStart, newEnd], [oldStart, oldEnd]) => {
  if (newStart?.getTime() !== oldStart?.getTime() || newEnd?.getTime() !== oldEnd?.getTime()) {
    loadExpenses()
  }
})
</script>

<style lang="scss" scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 20px 15px;
    max-width: 100%;
  }

  @media (max-width: 480px) {
    padding: 15px 10px;
  }
}

h1 {
  font-size: 28px;
  color: #2d3748;
  margin-bottom: 30px;
  line-height: 1.3;

  @media (max-width: 768px) {
    font-size: 26px;
    margin-bottom: 25px;
  }

  @media (max-width: 480px) {
    font-size: 22px;
    margin-bottom: 20px;
    text-align: center;
  }
}

.content-wrapper {
  display: flex;
  gap: 30px;
  align-items: flex-start;
  position: relative;

  @media (max-width: 1024px) {
    gap: 20px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 30px;
  }

  @media (max-width: 480px) {
    gap: 25px;
  }
}

.period-info {
  margin-top: 25px;
  font-size: 16px;
  color: #4a5568;
  padding: 12px 20px;
  background: #f8fafc;
  border-radius: 8px;
  display: inline-block;

  @media (max-width: 768px) {
    margin-top: 20px;
    font-size: 15px;
    width: 100%;
    text-align: center;
  }

  @media (max-width: 480px) {
    font-size: 14px;
    padding: 10px 15px;
  }

  .days-count {
    color: #718096;
    font-size: 0.9em;
    margin-left: 8px;

    @media (max-width: 480px) {
      display: block;
      margin-left: 0;
      margin-top: 4px;
    }
  }
}

.error-status {
  margin-top: 20px;
  color: #e53e3e;
  font-size: 14px;
  padding: 10px;
  border: 1px solid #fed7d7;
  border-radius: 6px;
  background: #fff5f5;

  @media (max-width: 480px) {
    font-size: 13px;
    text-align: center;
  }
}

:deep(.calendar-component),
:deep(.chart-component) {
  flex: 1;
  min-width: 0;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
  }
}

:deep(.chart-component) {
  @media (max-width: 480px) {
    transform: scale(0.98);
    margin-left: -5px;
  }
}
</style>
