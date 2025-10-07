# Проект для отслеживания транзакций.

Проект реализован на Vue.js 3. Использованы инструменты: Vite, Node.js, Vue Router, Axios для HTTP-запросов.

Что реализовано:

Защищенные маршруты: страница транзакций и анализа без авторизации не доступны, происходит редирект при попытке перехода на страницы.
Авторизация и регистрация с валидацией полей, проверкой пользователя.
На странице транзакций отображаются транзакции пользователя.
Реализовано добавление транзакции с валидацией полей.
На странице анализа реализован календарь с возможностью выбора периода. По умолчанию показан текущий месяц.
Реализован график, на котором отображаются расходы за выбранный в календаре период.
Данные для графика берутся из транзакций пользователя.
Подключены API пользователя и транзакций.
Реализована адаптация для мобильных устройств.
Ошибки при валидации полей показаны для пользователя.
Реализована страница 404, при несуществующем маршруте.
Кнопка выхода сбрасывает текущего пользователя.
.

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
