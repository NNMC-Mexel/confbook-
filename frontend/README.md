# Система бронирования конференц-залов

Веб-приложение для бронирования 2 конференц-залов. Позволяет сотрудникам просматривать расписание, бронировать залы анонимно или с авторизацией, и управлять своими бронированиями.

## Стек технологий

- **Frontend**: React (Vite) + Tailwind CSS + React Router + date-fns
- **Backend**: Strapi v5 + PostgreSQL
- **Деплой**: Coolify

## Структура проекта

```
project2/
├── frontend/          # React-приложение (порт 14000)
│   ├── src/
│   │   ├── api/       # HTTP-клиент и запросы к Strapi API
│   │   ├── components/
│   │   │   ├── Calendar/     # Недельный календарь с 2 залами
│   │   │   ├── BookingForm/  # Модальное окно бронирования
│   │   │   ├── BookingCard/  # Карточка бронирования
│   │   │   ├── Header/       # Шапка с навигацией
│   │   │   └── Modal/        # Переиспользуемое модальное окно
│   │   ├── pages/
│   │   │   ├── HomePage.jsx       # Главная — календарь
│   │   │   ├── LoginPage.jsx      # Вход / регистрация
│   │   │   └── MyBookingsPage.jsx # Мои бронирования
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Авторизация (Strapi JWT)
│   │   └── hooks/
│   │       ├── useBookings.js     # Загрузка бронирований
│   │       └── useRooms.js        # Загрузка залов
│   └── vite.config.js
└── server/            # Strapi backend (порт 15000)
    ├── config/        # Конфигурация БД, сервера, CORS, плагинов
    └── src/api/
        ├── room/      # Content Type: Room
        └── booking/   # Content Type: Booking
```

## Модель данных (Strapi Content Types)

**Room** — конференц-зал:
- `name` (string) — название
- `capacity` (integer) — вместимость
- `description` (text) — описание
- `color` (string) — цвет для UI

**Booking** — бронирование:
- `date` (date) — дата
- `startTime` / `endTime` (time) — время начала и конца
- `bookerName` (string) — имя бронирующего
- `department` (string) — отдел
- `topic` (string) — тема встречи
- `cancelCode` (string) — код отмены (для анонимных)
- `room` (relation → Room)
- `user` (relation → User, опционально)

## Запуск

### 1. Подготовка базы данных

Создайте базу данных `conference_rooms` в PostgreSQL. Параметры подключения по умолчанию: `localhost:5432`, пользователь `postgres`, пароль `postgres`. Изменить можно в `server/.env`.

### 2. Запуск Strapi (backend)

```bash
cd server
npm run develop
```

При первом запуске откроется админка — создайте admin-пользователя.

### 3. Настройка Strapi

В админке (`http://localhost:15000/admin`):

1. **Settings → Users & Permissions → Roles → Public**:
   - Room: включить `find`, `findOne`
   - Booking: включить `find`, `findOne`, `create`, `delete`
2. **Settings → Users & Permissions → Roles → Authenticated**:
   - Room: включить `find`, `findOne`
   - Booking: включить `find`, `findOne`, `create`, `delete`
3. **Content Manager → Room** — добавить 2 зала (например, "Зал 1" и "Зал 2")

### 4. Запуск фронтенда

```bash
cd frontend
npm run dev
```

Приложение будет доступно на `http://localhost:14000`.

## Функциональность

- **Календарь** — недельный вид с 2 колонками (по залу), сетка 8:00–20:00
- **Бронирование** — модальное окно с выбором зала, даты, времени, проверкой конфликтов
- **Анонимное бронирование** — указать имя + отдел, получить код отмены
- **Авторизация** — вход/регистрация через Strapi (JWT), управление своими бронями
- **Отмена** — по коду (анонимно) или из "Мои бронирования" (авторизованные)
- **Адаптивность** — мобильная версия с переключением дней
