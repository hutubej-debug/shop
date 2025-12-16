.PHONY: help build up down start stop restart logs clean install migrate seed studio prune

# Default target
help:
	@echo "🛒 Shopping List Manager - Available Commands"
	@echo ""
	@echo "  Setup & Start:"
	@echo "    make setup          - Complete setup (build, migrate, seed)"
	@echo "    make build          - Build Docker containers"
	@echo "    make up             - Start all services"
	@echo "    make start          - Start all services (alias for up)"
	@echo ""
	@echo "  Stop & Restart:"
	@echo "    make down           - Stop all services"
	@echo "    make stop           - Stop all services (alias for down)"
	@echo "    make restart        - Restart all services"
	@echo ""
	@echo "  Database:"
	@echo "    make migrate        - Run database migrations"
	@echo "    make seed           - Seed database with initial data"
	@echo "    make studio         - Open Prisma Studio"
	@echo "    make db-reset       - Reset database (migrate + seed)"
	@echo ""
	@echo "  Development:"
	@echo "    make install        - Install dependencies"
	@echo "    make logs           - View all logs"
	@echo "    make logs-app       - View Next.js app logs"
	@echo "    make logs-db        - View MySQL logs"
	@echo "    make shell          - Access Next.js container shell"
	@echo ""
	@echo "  Cleanup:"
	@echo "    make clean          - Stop and remove containers, volumes"
	@echo "    make prune          - Remove all unused Docker resources"
	@echo ""

# Complete setup
setup: build up wait-db migrate seed
	@echo ""
	@echo "✅ Setup complete!"
	@echo ""
	@echo "🌐 Application URLs:"
	@echo "   Main App: http://localhost"
	@echo "   Direct Next.js: http://localhost:3000"
	@echo ""

# Build containers
build:
	@echo "📦 Building Docker containers..."
	docker-compose build

# Start services
up:
	@echo "🚀 Starting services..."
	docker-compose up -d
	@echo "✅ Services started"

start: up

# Stop services
down:
	@echo "🛑 Stopping services..."
	docker-compose down
	@echo "✅ Services stopped"

stop: down

# Restart services
restart:
	@echo "🔄 Restarting services..."
	docker-compose restart
	@echo "✅ Services restarted"

# View logs
logs:
	docker-compose logs -f

logs-app:
	docker-compose logs -f nextjs

logs-db:
	docker-compose logs -f mysql

# Install dependencies
install:
	@echo "📚 Installing dependencies..."
	docker-compose exec nextjs npm install
	@echo "✅ Dependencies installed"

# Wait for database
wait-db:
	@echo "⏳ Waiting for MySQL to be ready..."
	@sleep 15
	@echo "✅ MySQL is ready"

# Database migrations
migrate:
	@echo "🗄️  Running database migrations..."
	docker-compose exec nextjs npx prisma generate
	docker-compose exec nextjs npx prisma migrate dev --name init
	@echo "✅ Migrations complete"

# Seed database
seed:
	@echo "🌱 Seeding database..."
	docker-compose exec nextjs npm run prisma:seed
	@echo "✅ Database seeded"

# Open Prisma Studio
studio:
	@echo "📊 Opening Prisma Studio..."
	docker-compose exec nextjs npx prisma studio

# Reset database
db-reset:
	@echo "🔄 Resetting database..."
	docker-compose exec nextjs npx prisma migrate reset --force
	@echo "✅ Database reset complete"

# Access container shell
shell:
	docker-compose exec nextjs /bin/sh

# Clean up
clean:
	@echo "🧹 Cleaning up..."
	docker-compose down -v
	@echo "✅ Cleanup complete"

# Prune Docker resources
prune:
	@echo "🗑️  Removing unused Docker resources..."
	docker system prune -af --volumes
	@echo "✅ Prune complete"
