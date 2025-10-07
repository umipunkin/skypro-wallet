<template>
  <div class="error-container">
    <h1>404</h1>
    <h2>Страница не найдена</h2>
    <p>Кажется, вы заблудились. Давайте поможем вам вернуться на главную страницу.</p>
    <router-link to="/" class="back-link"> Вернуться на главную </router-link>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #f0f0f0;
  padding: 20px;
}

h1 {
  font-size: 150px;
  color: #6a11cb;
  margin-bottom: 20px;
}

h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

p {
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
  text-align: center;
}

.back-link {
  display: inline-block;
  padding: 10px 20px;
  background-color: #6a11cb;
  color: white;
  border-radius: 3px;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.back-link:hover {
  background-color: #4a008f;
}

@media (max-width: 768px) {
  .error-container {
    padding: 15px;
  }

  h1 {
    font-size: 100px;
  }

  h2 {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 80px;
  }

  .back-link {
    padding: 8px 15px;
  }
}
</style>
