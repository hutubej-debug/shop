#!/bin/bash

echo "🚀 Starting Shopping List Manager Setup..."

# Build and start containers
echo "📦 Building Docker containers..."
docker-compose up -d --build

# Wait for MySQL to be ready
echo "⏳ Waiting for MySQL to be ready..."
sleep 15

# Install dependencies
echo "📚 Installing dependencies..."
docker-compose exec nextjs npm install

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
docker-compose exec nextjs npx prisma generate

# Run migrations
echo "🗄️  Running database migrations..."
docker-compose exec nextjs npx prisma migrate dev --name init

# Seed database
echo "🌱 Seeding database..."
docker-compose exec nextjs npm run prisma:seed

echo ""
echo "✅ Setup complete!"
echo ""
echo "🌐 Application URLs:"
echo "   Main App: http://localhost"
echo "   Direct Next.js: http://localhost:3000"
echo ""
echo "💡 Useful commands:"
echo "   View logs: docker-compose logs -f"
echo "   Stop: docker-compose down"
echo "   Restart: docker-compose restart"
echo "   Prisma Studio: docker-compose exec nextjs npx prisma studio"
echo ""
