# Vibe Habbit RPG

A full-stack gamified habit tracker with pixel art RPG theme. Track your habits like an RPG adventure!

## Features

- **Character Customization**: Customize your pixel art character with different heads, armor, weapons, and accessories
- **Skills System**: Create and manage skills that level up as you complete habits
- **Habits Tracking**: Add habits linked to skills, mark them as completed daily
- **XP & Leveling**: Gain XP for completing habits, skills level up every 5 XP
- **Stats Dashboard**: View your overall progress and character stats
- **14 Color Themes**: Choose from 14 unique RPG-themed color schemes (Dark Knight, Holy Paladin, Cappuccino Monk, Forest Ranger, Ocean Mage, Sunset Warrior, Cyber Ninja, Lava Berserker, Ice Sorcerer, Royal Guard, Desert Nomad, Toxic Alchemist, Sakura Samurai, Golden Emperor)
- **PWA Support**: Install as a Progressive Web App
- **Persistent Storage**: All data saved to SQLite3 database

## Architecture

- **Frontend**: React 18 + Vite + TailwindCSS + PWA
- **Backend**: Node.js + Express + SQLite3
- **Database**: SQLite3 with migrations support
- **Deployment**: Docker-ready with docker-compose

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### 1. Clone Repository

```bash
git clone <repository-url>
cd habbit
```

### 2. Set Up Backend

#### Install Backend Dependencies

```bash
cd backend
npm install
```

#### Set Up Environment Variables

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```env
DB_PATH=./data/habbit.db

PORT=3001
NODE_ENV=development

JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:5173
```

#### Run Migrations

```bash
npm run migrate
```

#### Start Backend Server

```bash
npm run dev
```

Backend will run on [http://localhost:3001](http://localhost:3001)

### 3. Set Up Frontend

#### Install Frontend Dependencies

```bash
# From project root
npm install
```

#### Configure Environment Variables

```bash
cp .env.example .env
```

The `.env` file should contain:

```env
VITE_API_URL=http://localhost:3001/api
```

#### Start Frontend Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

### Build for Production

#### Build Frontend

```bash
npm run build
```

The production build will be in the `dist/` directory.

#### Preview Production Build

```bash
npm run preview
```

## Docker Deployment

The easiest way to deploy Habbit RPG is using Docker and docker-compose.

### Prerequisites

- Docker 20.10+
- Docker Compose 2.0+

### Quick Start with Docker

1. **Build and Run with Docker Compose**

```bash
docker-compose up -d
```

This will:
- Build both frontend and backend images
- Start the backend on port 3001
- Start the frontend on port 80
- Create a persistent volume for the SQLite database
- Set up networking between containers

2. **Access the Application**

Open [http://localhost](http://localhost) in your browser.

3. **Stop the Application**

```bash
docker-compose down
```

4. **View Logs**

```bash
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Frontend only
docker-compose logs -f frontend
```

### Manual Docker Build

If you prefer to build and run containers manually:

#### Backend

```bash
cd backend
docker build -t habbit-backend .
docker run -d \
  -p 3001:3001 \
  -v habbit-data:/app/data \
  --name habbit-backend \
  habbit-backend
```

#### Frontend

```bash
docker build -t habbit-frontend .
docker run -d \
  -p 80:80 \
  --name habbit-frontend \
  habbit-frontend
```

### Production Deployment

For production deployment on a VPS or cloud server:

1. **Set Environment Variables**

Create a `.env` file in the project root:

```env
NODE_ENV=production
PORT=3001
VITE_API_URL=https://your-domain.com/api
```

2. **Update nginx Configuration**

If deploying behind a reverse proxy, update [nginx.conf](nginx.conf) with your domain.

3. **Run with SSL**

For SSL support, use a reverse proxy like nginx or Traefik in front of the containers.

Example nginx reverse proxy configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

4. **Database Backups**

The SQLite database is stored in a Docker volume. To backup:

```bash
docker run --rm \
  -v habbit-data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/habbit-backup.tar.gz -C /data .
```

To restore:

```bash
docker run --rm \
  -v habbit-data:/data \
  -v $(pwd):/backup \
  alpine tar xzf /backup/habbit-backup.tar.gz -C /data
```

## How to Use

1. **Choose Your Theme**: Click the theme selector (🎨) in the navigation to pick from 14 unique color themes
2. **Create Skills**: Go to the Skills page and add skills you want to improve (e.g., "Fitness", "Learning", "Creativity")
3. **Add Habits**: Go to the Habits page and create habits linked to your skills
4. **Daily Tracking**: Mark habits as completed each day to gain XP
5. **Level Up**: Every 5 XP on a habit increases the linked skill by 1 level
6. **Customize**: Visit the Character page to customize your pixel art hero
7. **View Progress**: Check the Dashboard to see your overall stats and progress

## Tech Stack

### Frontend
- React 18
- Vite
- TailwindCSS
- React Router v6
- PWA support via vite-plugin-pwa

### Backend
- Node.js with ES modules
- Express.js
- SQLite3 with better-sqlite3 driver
- Helmet for security
- CORS protection
- Rate limiting

## Project Structure

```
habbit/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Auth middleware
│   │   ├── migrations/      # Database migrations
│   │   ├── routes/          # API routes
│   │   └── server.js        # Express server
│   ├── .env.example
│   ├── package.json
│   └── README.md
├── src/
│   ├── components/          # React components
│   ├── contexts/            # React contexts (Auth)
│   ├── pages/               # Page components
│   ├── utils/               # Utilities (API, storage, themes)
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── public/
├── .env.example
├── DEPLOYMENT.md            # Deployment guide
├── package.json
└── README.md
```

## API Documentation

See [backend/README.md](backend/README.md) for complete API documentation.

### Key Endpoints

- `GET /api/character` - Get user's character
- `PUT /api/character` - Update character
- `GET /api/skills` - Get all skills
- `POST /api/skills` - Create new skill
- `PUT /api/skills/:id` - Update skill
- `DELETE /api/skills/:id` - Delete skill
- `GET /api/habits` - Get all habits
- `POST /api/habits` - Create new habit
- `PUT /api/habits/:id` - Update habit
- `DELETE /api/habits/:id` - Delete habit
- `POST /api/habits/:id/complete` - Complete habit for today
- `POST /api/habits/:id/uncomplete` - Uncomplete today's habit

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions covering:

- Vercel + Railway deployment
- VPS deployment (DigitalOcean, AWS, etc.)
- Docker deployment
- Database backups
- SSL configuration
- Monitoring setup

## Development

### Running Tests

```bash
# Frontend tests (if added)
npm test

# Backend tests (if added)
cd backend
npm test
```

### Database Migrations

Create a new migration:

```bash
cd backend/src/migrations
# Create file: YYYYMMDDHHMMSS_description.js
```

Run migrations:

```bash
cd backend
npm run migrate
```

### Code Style

- ESLint for JavaScript linting
- Prettier for code formatting
- Follow existing code patterns

## Game Mechanics

1. **Habit Completion**: Users mark habits as completed once per day
2. **XP Gain**: Each completion grants +1 XP to the habit
3. **Skill Leveling**: Every 5 XP accumulated on a habit levels up the linked skill by 1
4. **Character Progression**: Total XP tracks all habit completions
5. **Undo Support**: Users can uncomplete today's habit, reversing XP and level changes

## Security

- CORS protection
- Rate limiting on API endpoints
- Parameterized SQL queries to prevent injection
- Security headers with Helmet
- Environment variable protection

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- PWA support for offline functionality

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT

## Support

For issues or questions:
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for deployment help
- Check [backend/README.md](backend/README.md) for API documentation
- Open an issue on GitHub
