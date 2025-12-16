# 🛒 Shopping List Manager

A modern, real-time shopping list application with multi-store organization and price tracking.

## 🚀 Features

- **Store-Based Organization**: Group items by supermarket (Rewe, Aldi, Lidl, Penny, DM, Karadag)
- **Real-Time Sync**: Instant updates across all devices using Socket.IO
- **Price Tracking**: Track product prices over time
- **Category Management**: Organize products by categories (Dairy, Meat, Vegetables, etc.)
- **CRUD Operations**: Create, read, update, and delete shopping items
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Socket.IO
- **Database**: MySQL 8.0 with Prisma ORM
- **Caching**: Redis
- **Infrastructure**: Docker, Docker Compose, Nginx
- **State Management**: Zustand

## 📋 Prerequisites

- Docker Desktop installed
- Node.js 20+ (for local development)
- Git

## 🏃 Quick Start

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd "Shopping list"
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

### 3. Start with Docker Compose

```bash
# Start all services (MySQL, Redis, Next.js, Nginx)
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

### 4. Initialize the database

```bash
# Run migrations
docker-compose exec nextjs npx prisma migrate dev

# Seed initial data (stores & categories)
docker-compose exec nextjs npm run prisma:seed
```

### 5. Access the application

- **Application**: http://localhost
- **Direct Next.js**: http://localhost:3000
- **Prisma Studio**: `docker-compose exec nextjs npx prisma studio`

## 📁 Project Structure

```
Shopping list/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── components/        # React components
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── prisma/                # Database schema & migrations
│   ├── schema.prisma      # Prisma schema
│   └── seed.ts            # Database seeder
├── nginx/                 # Nginx configuration
│   ├── nginx.conf
│   └── conf.d/
├── lib/                   # Utility functions
├── types/                 # TypeScript types
├── docker-compose.yml     # Docker services
├── Dockerfile             # Next.js container
├── .env                   # Environment variables
└── package.json           # Dependencies
```

## 🗄️ Database Schema

### Tables

- **stores**: Supermarket chains (Rewe, Aldi, Lidl, Penny, DM, Karadag)
- **categories**: Product categories (Dairy, Meat, Vegetables, etc.)
- **products**: Product knowledge base
- **items**: Shopping list items
- **price_history**: Historical price tracking

## 📝 Available Scripts

```bash
# Development
npm run dev              # Start Next.js dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open Prisma Studio
npm run prisma:seed      # Seed database

# Docker
docker-compose up        # Start all services
docker-compose down      # Stop all services
docker-compose logs -f   # View logs
```

## 🔧 Development

### Local Development (without Docker)

1. Install dependencies:

```bash
npm install
```

2. Start MySQL and Redis locally or update `.env` to point to Docker services:

```bash
DATABASE_URL="mysql://shopuser:shoppassword@localhost:3306/shopping_list"
REDIS_URL="redis://localhost:6379"
```

3. Run migrations:

```bash
npx prisma migrate dev
npm run prisma:seed
```

4. Start development server:

```bash
npm run dev
```

## 🐳 Docker Services

- **nextjs**: Next.js application (port 3000)
- **mysql**: MySQL 8.0 database (port 3306)
- **redis**: Redis cache (port 6379)
- **nginx**: Reverse proxy (port 80)

## 🔐 Environment Variables

See `.env.example` for all available environment variables:

- `DATABASE_URL`: MySQL connection string
- `REDIS_URL`: Redis connection string
- `JWT_SECRET`: Secret for JWT tokens
- `NODE_ENV`: Environment (development/production)

## 📊 API Endpoints

### Items

- `GET /api/items` - Get all shopping items
- `POST /api/items` - Create new item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

### Stores

- `GET /api/stores` - Get all stores

### Categories

- `GET /api/categories` - Get all categories

## 🔄 Real-Time Features

Socket.IO events:

- `item:created` - New item added
- `item:updated` - Item modified
- `item:deleted` - Item removed
- `item:bought` - Item marked as bought

## 🚦 Roadmap

### Phase 1 (MVP) ✅

- [x] Docker setup
- [x] Database schema
- [x] Basic Next.js structure

### Phase 2 (In Progress)

- [ ] CRUD API endpoints
- [ ] Socket.IO integration
- [ ] Frontend components

### Phase 3

- [ ] User authentication
- [ ] Price analytics
- [ ] Mobile PWA

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
