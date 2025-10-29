# Interieurstijl App

Een full-stack applicatie voor het verkennen, aanpassen en visualiseren van interieurstijlen. Gebouwd met React, Vite, Express en Prisma.

## Inhoudsopgave

- [Overzicht](#overzicht)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structuur](#project-structuur)
- [Installatie](#installatie)
- [Development](#development)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Troubleshooting](#troubleshooting)

## Overzicht

De Interieurstijl App helpt gebruikers om verschillende interieurstijlen te ontdekken, aan te passen en te visualiseren. De applicatie biedt:

- **Stijlen Browser**: Ontdek 10+ verschillende interieurstijlen met gedetailleerde beschrijvingen
- **Style Editor**: Pas kleuren, materialen en intensiteit aan
- **Visualisatie Tool**: Upload foto's en visualiseer verschillende stijlen

## Features

### Huidige Features
- ✅ Browse interieurstijlen met gedetailleerde informatie
- ✅ Responsive design met Tailwind CSS
- ✅ RESTful API met Express
- ✅ File upload functionaliteit
- ✅ Prisma ORM voor database management

### Toekomstige Features
- 🔄 AI-powered style transfer voor foto's
- 🔄 Gebruikersauthenticatie
- 🔄 Project opslaan en delen
- 🔄 Kleurenpalet generator

## Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool en dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Axios** - HTTP client
- **React Dropzone** - File upload component

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Prisma** - ORM voor database
- **PostgreSQL** - Database
- **Multer** - File upload middleware
- **Helmet** - Security middleware
- **Morgan** - HTTP logger

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Nodemon** - Auto-restart server
- **Concurrently** - Run multiple commands

## Project Structuur

```
interieurstijl-app/
├── frontend/               # React frontend applicatie
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── layout/   # Layout components
│   │   │   ├── ui/       # Reusable UI components
│   │   │   └── modules/  # Feature-specific components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── utils/        # Utility functions
│   │   ├── data/         # Static data
│   │   └── styles/       # Global styles
│   └── package.json
│
├── backend/               # Express backend API
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # Express middleware
│   │   ├── models/       # Database models
│   │   └── config/       # Configuration files
│   ├── prisma/           # Prisma schema en migrations
│   ├── uploads/          # Uploaded files
│   └── package.json
│
└── package.json          # Root package.json
```

## Installatie

### Vereisten

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **PostgreSQL** >= 14.0

### Stap 1: Repository Klonen

```bash
# Als je git gebruikt
git clone <repository-url>
cd interieurstijl-app

# Of als je de directory al hebt
cd interieurstijl-app
```

### Stap 2: Dependencies Installeren

```bash
# Installeer alle dependencies (root, frontend, backend)
npm run install:all

# Of manueel:
npm install                  # Root dependencies
cd frontend && npm install   # Frontend dependencies
cd ../backend && npm install # Backend dependencies
```

### Stap 3: Environment Variables

#### Frontend (.env)
```bash
cd frontend
cp .env.example .env
```

Bewerk `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

#### Backend (.env)
```bash
cd backend
cp .env.example .env
```

Bewerk `backend/.env`:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://user:password@localhost:5432/interieurstijl?schema=public"
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
```

**Let op**: Vervang `user`, `password` met je PostgreSQL credentials.

### Stap 4: Database Setup

```bash
cd backend

# Genereer Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# (Optioneel) Seed database met test data
npm run prisma:seed

# (Optioneel) Open Prisma Studio om database te bekijken
npm run prisma:studio
```

## Development

### Beide Frontend & Backend Starten

Vanaf de root directory:

```bash
npm run dev
```

Dit start:
- Frontend op http://localhost:3000
- Backend op http://localhost:5000

### Alleen Frontend Starten

```bash
npm run dev:frontend
# Of
cd frontend && npm run dev
```

### Alleen Backend Starten

```bash
npm run dev:backend
# Of
cd backend && npm run dev
```

### Code Linting & Formatting

```bash
# Frontend
cd frontend
npm run lint
npm run format

# Backend
cd backend
npm run lint
npm run format
```

### Production Build

```bash
# Build frontend
npm run build
# Of
cd frontend && npm run build

# Output: frontend/dist/
```

## API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Styles

#### Get All Styles
```http
GET /api/styles
```

Response:
```json
[
  {
    "id": "uuid",
    "name": "Modern",
    "description": "Strak, minimalistisch...",
    "characteristics": ["Strakke lijnen", "..."],
    "colors": ["#FFFFFF", "#000000"],
    "materials": ["Glas", "Staal"],
    "imageUrl": "/assets/images/modern.jpg",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Get Style by ID
```http
GET /api/styles/:id
```

### Upload

#### Upload Image
```http
POST /api/upload
Content-Type: multipart/form-data
```

Body:
- `image`: File (jpeg, jpg, png, webp, max 10MB)

Response:
```json
{
  "message": "File uploaded successfully",
  "file": {
    "filename": "image-1234567890.jpg",
    "originalName": "room.jpg",
    "mimetype": "image/jpeg",
    "size": 1024000,
    "url": "/uploads/image-1234567890.jpg"
  }
}
```

### Projects

#### Get All Projects
```http
GET /api/projects
```

#### Create Project
```http
POST /api/projects
Content-Type: application/json
```

Body:
```json
{
  "name": "My Living Room",
  "imageUrl": "/uploads/image-123.jpg",
  "styleId": "uuid",
  "customColors": ["#FFFFFF", "#000000"]
}
```

#### Get Project by ID
```http
GET /api/projects/:id
```

#### Delete Project
```http
DELETE /api/projects/:id
```

### Health Check
```http
GET /health
```

## Database Schema

### Style Model
```prisma
model Style {
  id              String    @id @default(uuid())
  name            String
  description     String
  characteristics String[]
  colors          String[]
  materials       String[]
  imageUrl        String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  projects        Project[]
}
```

### Project Model
```prisma
model Project {
  id           String   @id @default(uuid())
  name         String
  imageUrl     String
  styleId      String
  style        Style    @relation(fields: [styleId], references: [id])
  customColors String[]
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

## Troubleshooting

### Port Already in Use

Als poort 3000 of 5000 al in gebruik is:

```bash
# Frontend: bewerk frontend/vite.config.js
server: {
  port: 3001, // Verander naar beschikbare poort
}

# Backend: bewerk backend/.env
PORT=5001
```

### Database Connection Error

```bash
# Check of PostgreSQL draait
pg_ctl status

# Start PostgreSQL
pg_ctl start

# Test database connection
psql -U user -d interieurstijl
```

### Prisma Errors

```bash
# Reset database (WAARSCHUWING: verwijdert alle data)
cd backend
npx prisma migrate reset

# Regenerate Prisma Client
npm run prisma:generate
```

### Module Not Found Errors

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### CORS Issues

Als je CORS errors krijgt, check of:
1. Backend draait op http://localhost:5000
2. Frontend `.env` heeft correcte `VITE_API_URL`
3. Backend CORS is enabled (check `backend/src/server.js`)

### File Upload Issues

```bash
# Check of uploads directory bestaat
cd backend
mkdir -p uploads

# Check file permissions
chmod 755 uploads
```

## Scripts Overzicht

### Root Scripts
- `npm run dev` - Start frontend & backend
- `npm run dev:frontend` - Start alleen frontend
- `npm run dev:backend` - Start alleen backend
- `npm run install:all` - Installeer alle dependencies
- `npm run build` - Build frontend voor productie

### Frontend Scripts
- `npm run dev` - Start dev server
- `npm run build` - Build voor productie
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code met Prettier

### Backend Scripts
- `npm run dev` - Start dev server met nodemon
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm run lint` - Run ESLint
- `npm run format` - Format code met Prettier

## Licentie

MIT

## Contact

Voor vragen of suggesties, open een issue of neem contact op.
