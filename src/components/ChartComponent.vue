<template>
  <div class="chart-container">
    <div class="chart-title">
      <h2>{{ periodLabel }}</h2>
      <p>Общая сумма расходов: {{ formattedTotal }} ₽</p>
    </div>
    <div class="chart">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import Chart from 'chart.js/auto'
import ChartDataLabels from 'chartjs-plugin-datalabels'

const props = defineProps({
  categories: {
    type: Array,
    default: () => ['Еда', 'Транспорт', 'Жилье', 'Развлечения', 'Образование', 'Другое'],
  },
  expenses: {
    type: Array,
    default: () => [],
  },
  startDate: String,
  endDate: String,
})

const normalizedCategories = {
  food: 'Еда',
  transport: 'Транспорт',
  housing: 'Жилье',
  entertainment: 'Развлечения',
  education: 'Образование',
  other: 'Другое',
}

const chartCanvas = ref(null)
let chartInstance = null

const chartData = computed(() => {
  const data = new Array(props.categories.length).fill(0)

  props.expenses.forEach(({ category, amount }) => {
    const russianCategory = normalizedCategories[category] || 'Другое'
    const index = props.categories.indexOf(russianCategory)
    if (index !== -1) data[index] += Number(amount) || 0
  })

  return data
})

const formattedTotal = computed(() => {
  const total = chartData.value.reduce((acc, val) => acc + val, 0)
  return new Intl.NumberFormat('ru-RU').format(total)
})

const periodLabel = computed(() => `${props.startDate} — ${props.endDate}` || 'Не выбран период')

const initChart = () => {
  if (chartInstance) chartInstance.destroy()

  if (!chartCanvas.value) return

  const ctx = chartCanvas.value.getContext('2d')

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: props.categories,
      datasets: [
        {
          label: 'Расходы по категориям',
          data: chartData.value,
          backgroundColor: ['#6d28d9', '#f6c177', '#4ecdc4', '#ff6b6b', '#457b9d', '#e17055'],
          borderColor: '#ffffff',
          borderWidth: 2,
          borderRadius: 8,
          barPercentage: 0.7,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
        datalabels: {
          anchor: 'end',
          align: 'top',
          formatter: (value) =>
            value > 0 ? new Intl.NumberFormat('ru-RU').format(value) + ' Р' : '',
          font: {
            weight: 'bold',
            size: 12,
          },
        },
      },
      scales: {
        y: {
          display: false,
          grid: { display: false },
          ticks: { display: false },
        },
        x: {
          grid: { display: false },
          ticks: {
            color: '#4a5568',
            font: { weight: '500' },
          },
        },
      },
      layout: {
        padding: {
          top: 30,
        },
      },
    },
    plugins: [ChartDataLabels],
  })
}

onMounted(initChart)

watch(
  [chartData, periodLabel],
  () => {
    if (!chartInstance) return

    chartInstance.data.datasets[0].data = chartData.value
    chartInstance.options.plugins.tooltip.enabled = props.expenses.length > 0
    chartInstance.update()
  },
  { deep: true },
)
</script>

<style lang="scss" scoped>
.chart-container {
  flex: 1;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 100%;

  ::v-deep .chartjs-datalabel {
    transform: translateY(-8px);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }
}

.chart-title {
  margin-bottom: 20px;

  @media (max-width: 480px) {
    margin-bottom: 15px;
  }

  h2 {
    font-size: 20px;
    color: #2d3748;
    margin-bottom: 4px;

    @media (max-width: 768px) {
      font-size: 18px;
    }

    @media (max-width: 480px) {
      font-size: 16px;
    }
  }

  p {
    font-size: 14px;
    color: #4a5568;

    @media (max-width: 480px) {
      font-size: 12px;
    }
  }
}

.chart {
  height: 400px;
  position: relative;

  @media (max-width: 768px) {
    height: 300px;
  }

  @media (max-width: 480px) {
    height: 250px;
  }

  canvas {
    width: 100% !important;
    height: 100% !important;
  }
}
</style>
