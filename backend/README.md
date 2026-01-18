# Habbit RPG Backend

Node.js REST API backend for Habbit RPG with SQLite3 database.

## Features

- **RESTful API** - Complete CRUD operations for habits, skills, and characters
- **SQLite3 Database** - Lightweight, reliable data persistence with migrations
- **JWT Authentication** - Secure user authentication and authorization
- **Database Migrations** - Easy schema management and versioning
- **Security** - CORS, Helmet, rate limiting, and bcrypt password hashing
- **Transaction Support** - Atomic operations for habit completions and XP updates

## Tech Stack

- Node.js with ES modules
- Express.js
- SQLite3 with better-sqlite3 driver
- JWT for authentication
- bcrypt for password hashing
- Helmet for security headers
- CORS for cross-origin requests
- Express Rate Limit for API rate limiting

## Prerequisites

- Node.js 18+
- npm or yarn

## Getting Started

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy the example environment file and update with your configuration:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
DB_PATH=./data/habbit.db

PORT=3001
NODE_ENV=development

JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:5173
```

### 3. Run Database Migrations

```bash
npm run migrate
```

This will create the SQLite3 database file and all necessary tables:
- `users` - User accounts
- `characters` - User characters with customization
- `skills` - Skills that level up
- `habits` - Daily habits linked to skills
- `completions` - Habit completion tracking
- `migrations` - Migration history

### 4. Start the Server

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:3001`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
  - Body: `{ email, password }`
  - Returns: `{ token, user }`

- `POST /api/auth/login` - Login user
  - Body: `{ email, password }`
  - Returns: `{ token, user }`

- `GET /api/auth/me` - Get current user
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ user }`

### Character

- `GET /api/character` - Get user's character
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ character }`

- `PUT /api/character` - Update character
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ name?, head?, chest?, legs?, weapon?, accessory? }`
  - Returns: `{ character }`

### Skills

- `GET /api/skills` - Get all skills
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ skills }`

- `POST /api/skills` - Create new skill
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ name }`
  - Returns: `{ skill }`

- `PUT /api/skills/:id` - Update skill
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ name?, level? }`
  - Returns: `{ skill }`

- `DELETE /api/skills/:id` - Delete skill
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ skill }`

### Habits

- `GET /api/habits` - Get all habits
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ habits }`

- `POST /api/habits` - Create new habit
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ name, skillId }`
  - Returns: `{ habit }`

- `PUT /api/habits/:id` - Update habit
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ name?, skillId? }`
  - Returns: `{ habit }`

- `DELETE /api/habits/:id` - Delete habit
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ habit }`

- `POST /api/habits/:id/complete` - Complete habit for today
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ message }`
  - Automatically: Increases habit XP by 1, levels up skill every 5 XP, increases character total XP

- `DELETE /api/habits/:id/complete` - Uncomplete habit for today
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ message }`
  - Automatically: Decreases habit XP, reverses skill level if needed

- `GET /api/habits/completions` - Get all habit completions
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ completions }`

## Database Schema (SQLite3)

### users
- `id` - Integer primary key
- `email` - Unique email address
- `password_hash` - Bcrypt hashed password
- `created_at` - Registration timestamp
- `updated_at` - Last update timestamp

### characters
- `id` - Integer primary key
- `user_id` - Foreign key to users (unique)
- `name` - Character name
- `head`, `chest`, `legs`, `weapon`, `accessory` - Appearance integers
- `total_xp` - Total XP accumulated
- `created_at`, `updated_at` - Timestamps

### skills
- `id` - Integer primary key
- `user_id` - Foreign key to users
- `name` - Skill name
- `level` - Current skill level (starts at 0)
- `created_at`, `updated_at` - Timestamps

### habits
- `id` - Integer primary key
- `user_id` - Foreign key to users
- `skill_id` - Foreign key to skills (nullable)
- `name` - Habit name
- `xp` - Current XP (starts at 0)
- `created_at`, `updated_at` - Timestamps

### completions
- `id` - Integer primary key
- `habit_id` - Foreign key to habits
- `completed_date` - Date of completion (unique per habit)
- `created_at` - Timestamp
- Constraint: One completion per habit per day

## Game Mechanics

1. **Habit Completion**: Users mark habits as completed once per day
2. **XP Gain**: Each completion grants +1 XP to the habit
3. **Skill Leveling**: Every 5 XP accumulated on a habit levels up the linked skill by 1
4. **Character Progression**: Total XP tracks all habit completions
5. **Undo Support**: Users can uncomplete today's habit, reversing XP and level changes

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt with salt rounds
- **CORS Protection**: Restricted to configured frontend URL
- **Helmet**: Security headers for common vulnerabilities
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Server-side validation on all endpoints
- **SQL Injection Protection**: Parameterized queries with better-sqlite3

## Creating New Migrations

Migrations are JavaScript files in `src/migrations/` following the naming pattern:
`YYYYMMDDHHMMSS_description.js`

Example migration:

```javascript
import { query } from '../config/database.js';

export async function up() {
  await query(`
    ALTER TABLE habits
    ADD COLUMN archived BOOLEAN DEFAULT FALSE
  `);
}

export async function down() {
  await query(`
    ALTER TABLE habits
    DROP COLUMN archived
  `);
}
```

Run migrations:
```bash
npm run migrate
```

## Production Deployment

### Environment Variables

Ensure all production environment variables are set:
- `NODE_ENV=production`
- Strong `JWT_SECRET`
- Proper `DB_PATH` for database location
- Proper `FRONTEND_URL` for CORS

### Database

- Set up regular backups by copying the SQLite3 database file
- Example backup: `cp ./data/habbit.db ./backups/habbit_$(date +%Y%m%d_%H%M%S).db`
- Store backups in a secure location with proper permissions

### Server

- Use a process manager like PM2
- Set up reverse proxy with Nginx
- Enable SSL/TLS certificates
- Configure firewall rules
- Monitor logs and metrics

### Example PM2 Configuration

```javascript
module.exports = {
  apps: [{
    name: 'habbit-api',
    script: './src/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    }
  }]
}
```

## Health Check

Check if the API is running:

```bash
curl http://localhost:3001/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2026-01-17T..."
}
```

## Troubleshooting

### Database Connection Issues

1. Verify the database file exists at the path specified in `DB_PATH`
2. Check that the directory containing the database file has proper read/write permissions
3. If the database file is missing, run migrations to recreate it: `npm run migrate`

### Migration Errors

- Ensure database is accessible
- Check migration files for syntax errors
- Migrations are run sequentially based on timestamp

### Authentication Errors

- Verify JWT_SECRET is set in `.env`
- Check token expiration time
- Ensure Authorization header format: `Bearer <token>`

## License

MIT
