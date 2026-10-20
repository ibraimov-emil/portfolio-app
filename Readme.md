# Portfolio & Marketplace App — Fullstack Ecosystem

Комплексный веб-проект, объединяющий современное портфолио, CMS для управления контентом и Python-бэкенд для маркетплейса и строительных калькуляторов.

---

## 🏗 Архитектура проекта

Проект организован по схеме **Monorepo** и состоит из трех независимых сервисов:

```text
├── client/          # Frontend: Next.js 15/16 (App Router), React 19, TailwindCSS, Radix UI
├── backend/         # Content CMS: Strapi 5 (TypeScript, REST API, WebSockets, Uploads)
├── python-backend/  # Services & Marketplace: Django 5, Django REST Framework, WhiteNoise
├── Dockerfile       # Корневой Dockerfile для сборки Strapi на Amvera
└── amvera.yaml      # Конфигурация деплоя бэкенда на облако Amvera
```

### Технологический стек:
- **База данных**: [Neon Tech](https://neon.tech/) Serverless PostgreSQL (общая база данных для Strapi и Django).
- **Frontend**: Next.js (App Router), React 19, TanStack Query, Redux Toolkit, Lucide Icons, Radix UI.
- **CMS**: Strapi 5 (Node.js 22, TypeScript, автогенерация API).
- **Microservice / Marketplace**: Python 3.11+, Django REST Framework, JWT-аутентификация (совместимая с токенами Strapi).
- **Хостинг**:
  - Фронтенд (`client`) ➔ **Vercel**
  - CMS (`backend`) ➔ **Amvera Cloud** (Docker)
  - Сервис маркетплейса (`python-backend`) ➔ **Vercel** (Serverless WSGI)

---

## 💻 Локальный запуск (Local Development)

### Требования:
- Node.js >= 20.x (рекомендуется 22.x)
- Python >= 3.11
- npm / pip

---

### 1. Запуск Strapi CMS (`backend`)

1. Перейдите в папку бэкенда:
   ```bash
   cd backend
   ```
2. Установите зависимости:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Создайте файл `.env` на основе `.env.example`:
   ```bash
   cp .env.example .env
   ```
   *(Заполните параметры подключения к базе данных или оставьте SQLite по умолчанию `DATABASE_CLIENT=sqlite`)*.
4. Запустите в режиме разработки:
   ```bash
   npm run develop
   ```
   - Strapi API: `http://localhost:1337`
   - Админ-панель: `http://localhost:1337/admin`

---

### 2. Запуск Python Backend (`python-backend`)

1. Перейдите в папку сервиса:
   ```bash
   cd python-backend
   ```
2. Создайте и активируйте виртуальное окружение:
   - **Windows (PowerShell)**:
     ```powershell
     python -m venv venv
     .\venv\Scripts\Activate.ps1
     ```
   - **Linux / macOS**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```
3. Установите зависимости:
   ```bash
   pip install -r requirements.txt
   ```
4. Создайте `.env` и включите локальный дебаг:
   ```env
   DEBUG=True
   SECRET_KEY=django-insecure-local-dev-key
   DATABASE_URL=postgres://user:password@host:5432/dbname?sslmode=require
   JWT_SECRET=your-strapi-jwt-secret
   ```
5. Примените миграции:
   ```bash
   python manage.py migrate
   ```
6. (Опционально) Создайте суперпользователя:
   ```bash
   python manage.py createsuperuser
   ```
7. Запустите сервер:
   ```bash
   python manage.py runserver 8000
   ```
   - API: `http://localhost:8000/api/marketplace/`
   - Django Admin: `http://localhost:8000/admin/`

---

### 3. Запуск Frontend клиента (`client`)

1. Перейдите в папку клиента:
   ```bash
   cd client
   ```
2. Установите зависимости:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Настройте файл `.env`:
   ```env
   NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
   NEXT_PUBLIC_API_URL=http://localhost:1337/api
   NEXT_PUBLIC_PYTHON_API_URL=http://localhost:8000
   ```
4. Запустите dev-сервер:
   ```bash
   npm run dev
   ```
   - Приложение откроется на: `http://localhost:3000`

---

## 🚀 Развёртывание в продакшн (Production Deployment)

### 1. Strapi CMS ➔ Amvera Cloud

Сборка Strapi настроена через корневой [Dockerfile](./Dockerfile) и [amvera.yaml](./amvera.yaml).

1. Создайте проект типа **Docker** в [Amvera Cloud](https://cloud.amvera.ru/).
2. Подключите Git-репозиторий (ветка `main`).
3. В разделе **Конфигурация** проверьте:
   - Сборка: `Dockerfile`
   - Порт: `1337`
   - Постоянное хранилище (Persistence): `/app/public/uploads`
4. В разделе **Переменные окружения** добавьте:
   ```env
   NODE_ENV=production
   NODE_OPTIONS=--dns-result-order=ipv4first
   HOST=0.0.0.0
   PORT=1337
   DATABASE_CLIENT=postgres
   DATABASE_URL=postgres://default:PASSWORD@NEON_HOST:5432/verceldb?sslmode=require
   DATABASE_SSL=true
   DATABASE_SSL_REJECT_UNAUTHORIZED=false
   APP_KEYS=key1,key2,key3,key4
   API_TOKEN_SALT=generated_salt
   ADMIN_JWT_SECRET=generated_secret
   TRANSFER_TOKEN_SALT=generated_salt
   JWT_SECRET=generated_secret
   ```
5. Сделайте `git push origin main` — Amvera автоматически соберет контейнер на базе `node:22-alpine` и запустит Strapi.

---

### 2. Python Backend ➔ Vercel (Serverless WSGI)

Разворачивается как Serverless-функция Python 3.12 без Docker:

1. Зайдите в [Vercel](https://vercel.com/) ➔ **Add New...** ➔ **Project**.
2. Выберите репозиторий `portfolio-app`.
3. **ВАЖНО**: В настройках проекта найдите пункт **Root Directory**, нажмите **Edit** и выберите:
   ```text
   python-backend
   ```
4. В разделе **Environment Variables** укажите:
   ```env
   SECRET_KEY=your-production-django-secret
   DATABASE_URL=postgres://default:PASSWORD@NEON_HOST:5432/verceldb?sslmode=require
   DEBUG=False
   JWT_SECRET=your-strapi-jwt-secret
   ```
5. Нажмите **Deploy**. Vercel автоматически соберет зависимости через `uv` и запустит точку входа `config/wsgi.py`.

---

### 3. Frontend Client ➔ Vercel

1. В [Vercel](https://vercel.com/) создайте проект для клиента.
2. В **Root Directory** выберите:
   ```text
   client
   ```
3. В разделе **Environment Variables** укажите боевые URL сервисов:
   ```env
   NEXT_PUBLIC_STRAPI_URL=https://strapi-back-emilibramovich.waw0.amvera.tech
   NEXT_PUBLIC_API_URL=https://strapi-back-emilibramovich.waw0.amvera.tech/api
   NEXT_PUBLIC_PYTHON_API_URL=https://<your-python-backend>.vercel.app
   ```
4. Нажмите **Deploy**.
5. Если используются внешние изображения со Strapi, они уже разрешены в [next.config.ts](./client/next.config.ts) (`remotePatterns` для домена Strapi на Amvera).

---

## 🔑 Сводка переменных окружения (Environment Variables)

| Сервис | Переменная | Описание |
|---|---|---|
| **Strapi** | `DATABASE_URL` | Строка подключения к PostgreSQL (Neon DB) |
| **Strapi** | `DATABASE_SSL` | `true` (для облачных баз данных) |
| **Strapi** | `JWT_SECRET` | Ключ подписи токенов пользователей |
| **Strapi** | `APP_KEYS` | Секретные ключи приложения Strapi (через запятую) |
| **Python** | `DATABASE_URL` | Строка подключения к PostgreSQL |
| **Python** | `JWT_SECRET` | Тот же секрет JWT, что и в Strapi (для сквозной авторизации) |
| **Python** | `SECRET_KEY` | Секретный ключ Django |
| **Client** | `NEXT_PUBLIC_STRAPI_URL` | URL Strapi (без `/api`) |
| **Client** | `NEXT_PUBLIC_API_URL` | URL Strapi API (`<url>/api`) |
| **Client** | `NEXT_PUBLIC_PYTHON_API_URL` | URL Python/Django микросервиса |

---

## 📝 Настройка Strapi после деплоя (First Run Checklist)

1. Откройте `https://<ваш-домен-strapi>/admin` и зарегистрируйте аккаунт Super Admin.
2. Перейдите в **Settings** ➔ **Users & Permissions** ➔ **Roles** ➔ **Public**:
   - Отметьте `find` и `findOne` для публичных коллекций (`Skill`, `Company`, `Practice`, `Vacancy`).
   - Нажмите **Save**.
3. В **Content Manager** создайте и **ОПУБЛИКУЙТЕ (Publish)** записи.