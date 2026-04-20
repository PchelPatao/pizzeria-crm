# 🍕 Pizzeria CRM

Kanban-система CRM, разработанная для сотрудников пиццерии, позволяющая эффективно управлять заказами. Проект создан с использованием современного стека технологий: Vue 3, Tailwind CSS, FastAPI и SQLAlchemy.

## ✨ Возможности (Features)

- **Аутентификация пользователей**: Безопасная система регистрации и входа с использованием JWT-токенов.
- **Управление заказами**: Создание новых заказов с указанием данных клиента, типа пиццы, размера и количества.
- **Kanban-доска**: Визуализация и управление заказами на интерактивной доске с разделением по статусам:
  - 🆕 Новые (New)
  - 👨‍🍳 Готовятся (Preparing)
  - 📦 Готовы (Ready)
  - 🚚 Доставлены (Delivered)
- **Обновление статусов**: Быстрое перемещение заказов между этапами готовности.
- **Редактирование заказов**: Возможность изменения деталей заказа после его создания.
- **Удаление**: Удаление завершенных или отмененных заказов.

## 🛠️ Стек технологий

**Frontend:**
- [Vue 3](https://vuejs.org/) (Composition API)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

**Backend:**
- [FastAPI](https://fastapi.tiangolo.com/)
- [Python 3](https://www.python.org/)
- [SQLAlchemy](https://www.sqlalchemy.org/) (ORM)
- [SQLite](https://www.sqlite.org/) (База данных)
- **Аутентификация**: PyJWT, Passlib

## 📂 Структура проекта

```text
pizzeria-crm/
├── backend/          # FastAPI приложение (Серверная часть)
│   ├── main.py       # Точка входа приложения и маршруты (роуты)
│   ├── auth.py       # Логика аутентификации и работа с JWT
│   ├── database.py   # Настройка подключения к базе данных
│   ├── models.py     # SQLAlchemy ORM модели базы данных
│   ├── schemas.py    # Pydantic схемы для валидации данных
│   └── requirements.txt
└── frontend/         # Vue 3 приложение (Клиентская часть)
    ├── src/
    │   ├── components/ # Vue компоненты (Dashboard, Login, Register, OrderForm)
    │   ├── App.vue     # Корневой компонент
    │   ├── main.ts     # Точка входа Frontend
    │   └── store.ts    # Управление состоянием (Store)
    ├── package.json
    └── tailwind.config.js
```

## 🚀 Инструкция по запуску

### 1. Запуск Backend (Серверной части)

Перейдите в директорию `backend`:
```bash
cd backend
```

Создайте и активируйте виртуальное окружение:
```bash
# Для Windows
python -m venv .venv
.\.venv\Scripts\activate

# Для Mac/Linux
python3 -m venv .venv
source .venv/bin/activate
```

Установите необходимые зависимости:
```bash
pip install -r requirements.txt
```

Запустите сервер для разработки:
```bash
uvicorn main:app --reload
```
Сервер FastAPI будет запущен по адресу `http://localhost:8000`.

*Примечание: База данных SQLite (`pizzeria.db`) будет создана автоматически при первом запуске.*

### 2. Запуск Frontend (Клиентской части)

Откройте новое окно терминала и перейдите в директорию `frontend`:
```bash
cd frontend
```

Установите NPM зависимости:
```bash
npm install
```

Запустите сервер для разработки Vite:
```bash
npm run dev
```
Приложение Vue будет доступно в браузере по адресу `http://localhost:5173`.

## 📚 API Документация

FastAPI автоматически генерирует интерактивную документацию для API. После запуска серверной части вы можете получить к ней доступ по следующим ссылкам:

- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
