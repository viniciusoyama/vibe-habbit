# Deployment Guide for Habbit RPG

This guide covers deploying the full-stack Habbit RPG application to production.

## Architecture Overview

- **Frontend**: React SPA with PWA support (Vite build)
- **Backend**: Node.js REST API (Express)
- **Database**: SQLite3
- **Authentication**: JWT with HTTP-only cookies

## Deployment Options

### Option 1: Vercel + Railway (Recommended for Quick Setup)

#### Backend on Railway

1. Create account at [Railway.app](https://railway.app)

2. Create new project:
   ```
   New Project → Empty Project
   ```

3. Deploy backend:
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli

   # Login
   railway login

   # Link project
   cd backend
   railway link

   # Add environment variables in Railway dashboard:
   # - All variables from .env.example
   # - DB_PATH=/app/data/habbit.db (Railway will persist this using volumes)

   # Deploy
   railway up
   ```

4. Run migrations:
   ```bash
   railway run npm run migrate
   ```

#### Frontend on Vercel

1. Create account at [Vercel.com](https://vercel.com)

2. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

3. Configure frontend:
   ```bash
   # Create .env.production in root directory
   echo "VITE_API_URL=https://your-backend-url.railway.app/api" > .env.production
   ```

4. Deploy:
   ```bash
   vercel --prod
   ```

5. Configure custom domain (optional) in Vercel dashboard

### Option 2: DigitalOcean / AWS / VPS

#### 1. Server Setup (Ubuntu 22.04)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Nginx
sudo apt install -y nginx

# Install PM2 for process management
sudo npm install -g pm2
```

#### 2. Deploy Backend

```bash
# Create app directory
sudo mkdir -p /var/www/habbit-rpg
sudo chown -R $USER:$USER /var/www/habbit-rpg

# Clone or upload your code
cd /var/www/habbit-rpg
git clone <your-repo-url> .

# Install backend dependencies
cd backend
npm install --production

# Create .env file
nano .env
# Add all production environment variables

# Run migrations
npm run migrate

# Start with PM2
pm2 start src/server.js --name habbit-api
pm2 save
pm2 startup
```

#### 4. Build and Deploy Frontend

```bash
# Build frontend
cd /var/www/habbit-rpg
npm install
npm run build

# Frontend files are now in dist/ directory
```

#### 4. Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/habbit-rpg
```

Add this configuration:

```nginx
# API Backend
server {
    listen 80;
    server_name api.your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Frontend
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    root /var/www/habbit-rpg/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

Enable site and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/habbit-rpg /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 5. SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificates
sudo certbot --nginx -d your-domain.com -d www.your-domain.com -d api.your-domain.com

# Auto-renewal is set up automatically
```

### Option 3: Docker Deployment

#### 1. Create Dockerfiles

**Backend Dockerfile** (`backend/Dockerfile`):

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3001

CMD ["node", "src/server.js"]
```

**Frontend Dockerfile** (`Dockerfile`):

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf**:

```nginx
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### 2. Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    environment:
      DB_PATH: /app/data/habbit.db
      JWT_SECRET: ${JWT_SECRET}
      NODE_ENV: production
      FRONTEND_URL: ${FRONTEND_URL}
    volumes:
      - sqlite_data:/app/data
    ports:
      - "3001:3001"

  frontend:
    build: .
    depends_on:
      - backend
    environment:
      VITE_API_URL: ${API_URL}
    ports:
      - "80:80"

volumes:
  sqlite_data:
```

#### 3. Deploy with Docker

```bash
# Create .env file with all variables
nano .env

# Build and start
docker-compose up -d

# Run migrations
docker-compose exec backend npm run migrate

# View logs
docker-compose logs -f
```

## Environment Variables Checklist

### Backend (.env)

- [ ] `DB_PATH` - Path to SQLite database file (e.g., ./data/habbit.db)
- [ ] `PORT` - API port (3001)
- [ ] `NODE_ENV` - Set to "production"
- [ ] `JWT_SECRET` - Strong random secret (use: `openssl rand -base64 32`)
- [ ] `JWT_EXPIRES_IN` - Token expiration (7d)
- [ ] `FRONTEND_URL` - Your frontend URL for CORS

### Frontend (.env.production)

- [ ] `VITE_API_URL` - Your backend API URL (https://api.your-domain.com/api)

## Post-Deployment Checklist

- [ ] Backend is accessible and returns health check
- [ ] Frontend loads and displays login page
- [ ] User registration works
- [ ] User login works
- [ ] Can create skills, habits, and character
- [ ] Habit completion increases XP and levels
- [ ] PWA installs correctly
- [ ] SSL certificates are active
- [ ] Database backups are configured
- [ ] Monitoring is set up (optional: PM2, DataDog, etc.)
- [ ] Rate limiting is working
- [ ] CORS is properly configured
- [ ] Error logging is working

## Database Backups

### Automated Daily Backups

```bash
# Create backup script
nano /usr/local/bin/backup-habbit-db.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/habbit-rpg"
DB_PATH="/var/www/habbit-rpg/backend/data/habbit.db"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/habbit_rpg_$TIMESTAMP.db"

mkdir -p $BACKUP_DIR

# Copy database file
cp $DB_PATH $BACKUP_FILE

# Compress
gzip $BACKUP_FILE

# Delete backups older than 30 days
find $BACKUP_DIR -name "*.db.gz" -mtime +30 -delete

echo "Backup completed: $BACKUP_FILE.gz"
```

```bash
# Make executable
chmod +x /usr/local/bin/backup-habbit-db.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-habbit-db.sh
```

### Manual Backup

```bash
# Simple file copy
cp /var/www/habbit-rpg/backend/data/habbit.db backup.db

# Or with timestamp
cp /var/www/habbit-rpg/backend/data/habbit.db habbit_backup_$(date +%Y%m%d).db
```

### Restore from Backup

```bash
# Stop the backend first
pm2 stop habbit-api

# Restore database
cp backup.db /var/www/habbit-rpg/backend/data/habbit.db

# Restart backend
pm2 start habbit-api
```

## Monitoring

### PM2 Monitoring

```bash
# View status
pm2 status

# View logs
pm2 logs habbit-api

# Monitor metrics
pm2 monit
```

### Database Monitoring

```bash
# Check database size
ls -lh /var/www/habbit-rpg/backend/data/habbit.db

# Or with human-readable format
du -h /var/www/habbit-rpg/backend/data/habbit.db
```

## Troubleshooting

### Backend Issues

```bash
# Check backend logs
pm2 logs habbit-api

# Restart backend
pm2 restart habbit-api

# Check if backend is running
curl http://localhost:3001/health
```

### Database Issues

```bash
# Check if database file exists
ls -la /var/www/habbit-rpg/backend/data/habbit.db

# Check file permissions
ls -l /var/www/habbit-rpg/backend/data/habbit.db

# Re-run migrations if needed
cd /var/www/habbit-rpg/backend
npm run migrate

# If database is corrupted, restore from backup
pm2 stop habbit-api
cp /var/backups/habbit-rpg/latest_backup.db /var/www/habbit-rpg/backend/data/habbit.db
pm2 start habbit-api
```

### Frontend Issues

```bash
# Check Nginx status
sudo systemctl status nginx

# Check Nginx config
sudo nginx -t

# View Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

## Scaling Considerations

1. **Database**: Use read replicas for read-heavy operations
2. **Backend**: Add load balancer and multiple API instances
3. **Frontend**: Use CDN for static assets (Cloudflare, AWS CloudFront)
4. **Caching**: Add Redis for session management and caching
5. **Monitoring**: Use APM tools (New Relic, DataDog, Sentry)

## Security Best Practices

1. Keep all dependencies updated
2. Use strong JWT secrets (32+ random characters)
3. Enable firewall (UFW on Ubuntu)
4. Restrict database access to localhost only (if possible)
5. Use environment variables for all secrets
6. Enable HTTPS only in production
7. Regular security audits with `npm audit`
8. Implement rate limiting on API endpoints
9. Use prepared statements for database queries (already implemented)
10. Regular database backups

## Support

For issues or questions:
- Check backend logs: `pm2 logs habbit-api`
- Check database file exists: `ls -la /var/www/habbit-rpg/backend/data/habbit.db`
- Verify environment variables are set correctly
- Ensure migrations have run: `npm run migrate`
