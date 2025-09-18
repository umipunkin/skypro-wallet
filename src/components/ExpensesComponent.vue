<template>
  <div class="container">
    <h1>Мои расходы</h1>

    <div class="add-button-container">
      <button class="add-button" @click="showModal = true">+ Добавить расход</button>
    </div>

    <div class="content-wrapper">
      <ExpensesTable />

      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal-content">
          <NewExpenseModal @close="showModal = false" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ExpensesTable from './ExpensesTable.vue'
import NewExpenseModal from './NewExpenseModal.vue'
import { ref } from 'vue'

const showModal = ref(false)
</script>

<style lang="scss" scoped>
.container {
  max-width: 100%;
  margin: 0 auto;
  padding: 30px;

  @media (max-width: 768px) {
    padding: 20px 15px;
  }

  @media (max-width: 480px) {
    padding: 15px 10px;
  }
}

h1 {
  font-size: 28px;
  color: #2d3748;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 26px;
    margin-bottom: 20px;
  }

  @media (max-width: 480px) {
    font-size: 22px;
    margin-bottom: 16px;
    text-align: center;
  }
}

.add-button-container {
  margin-bottom: 24px;
  text-align: right;
}

.add-button {
  background: #7334ea;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #5a2dbb;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 14px;
  }
}

.content-wrapper {
  display: flex;
  gap: 30px;
  align-items: flex-start;

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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}
</style>
