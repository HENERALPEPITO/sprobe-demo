# Sprobe Demo Application

This is a Laravel application with React frontend, using Docker for development environment.

## Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- Git

## Setup Instructions

### Quick Start (Development)

1. Clone and setup:
```bash
# Clone the repository
git clone https://github.com/HENERALPEPITO/sprobe-demo.git
cd sprobe-demo

# Copy environment file
cp .env.example .env

# Start Docker containers
docker-compose up -d

# Install dependencies and setup application
docker-compose exec app composer install
npm install
docker-compose exec app php artisan key:generate
docker-compose exec app php artisan migrate:fresh --seed
npm run build
```

2. Visit http://localhost:8000 and log in with:
   - Email: test@example.com
   - Password: password

### Detailed Setup Instructions

2. Copy the environment file:
```bash
cp .env.example .env
```

3. Configure the environment variables in `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=sprobe_demo
DB_USERNAME=root
DB_PASSWORD=1234
```

4. Build and start the Docker containers:
```bash
docker-compose up -d --build
```

5. Install PHP dependencies:
```bash
docker-compose exec app composer install
```

6. Install Node.js dependencies:
```bash
docker-compose exec app npm install
```

7. Generate Laravel application key:
```bash
docker-compose exec app php artisan key:generate
```

8. Run database migrations and seeders:
```bash
docker-compose exec app php artisan migrate:fresh --seed
```

9. Build frontend assets:
```bash
docker-compose exec app npm run build
```

10. For development, start the Vite development server:
```bash
npm run dev
```

## Accessing the Application

- Main application: [http://localhost:8000](http://localhost:8000)
- Vite dev server: [http://localhost:5174](http://localhost:5174)

## Docker Container Structure

The application runs using three Docker containers:
- **app**: PHP-FPM container for Laravel application
- **webserver**: Nginx web server
- **db**: MySQL database

## Database Connection

The MySQL database is accessible:
- From host machine: `localhost:3307`
- From within Docker network: `db:3306`

## Useful Commands

### Docker Commands
```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# View container logs
docker-compose logs

# Access app container shell
docker-compose exec app bash

# Rebuild containers
docker-compose up -d --build
```

### Laravel Commands
```bash
# Clear configuration cache
docker-compose exec app php artisan config:clear

# Run migrations
docker-compose exec app php artisan migrate

# Run seeders
docker-compose exec app php artisan db:seed

# Clear all caches
docker-compose exec app php artisan optimize:clear
```

### Frontend Commands
```bash
# Start Vite development server
npm run dev

# Build for production
npm run build
```

## Project Features

1. Employee Management
   - List, create, update, and delete employees
   - Track employee information including position and department
   - Employee status management
   - File upload/download functionality for employee documents
   - Paginated employee listing with search and sorting

2. Review Templates
   - Create and manage review templates
   - Assign templates to employees
   - Track review status and history
   - Paginated template listing

3. User Authentication
   - Secure login and registration
   - Password reset functionality
   - User profile management

4. Performance Optimizations
   - Database query optimization with eager loading
   - API Resources for consistent response formatting
   - Database indexes for frequently queried fields
   - Efficient file handling with secure storage

5. Code Quality
   - Comprehensive test coverage with PHPUnit
   - Type-safe TypeScript implementation
   - Responsive design with Tailwind CSS
   - Error handling and logging

## Running Tests

```bash
# Run all tests
docker-compose exec app php artisan test

# Run specific test file
docker-compose exec app php artisan test --filter EmployeeTest

# Run tests with coverage report
docker-compose exec app php artisan test --coverage
```

## File Upload Feature

The application supports secure file uploads for employee documents:

1. Supported Operations:
   - Upload files (up to 10MB per file)
   - Download files securely
   - Delete files
   - View file metadata (size, type, upload date)

2. Security Features:
   - File size validation
   - Secure file storage outside public directory
   - File type validation
   - User authorization checks

3. Usage:
   - Files can be attached to employee records
   - Files are stored in a private disk
   - Downloads are streamed securely
   - Automatic cleanup when employee is deleted

## Troubleshooting

1. If you encounter database connection issues:
   - Ensure MySQL container is running: `docker-compose ps`
   - Check MySQL logs: `docker-compose logs db`
   - Verify database credentials in `.env`
   - Try resetting the database: `docker-compose exec app php artisan migrate:fresh --seed`

2. If the application shows a blank page:
   - Check if frontend assets are built: Run `npm run build`
   - Check Laravel logs: `docker-compose exec app php artisan logs`

3. For permission issues:
   - Fix storage permissions: `docker-compose exec app chown -R www-data:www-data storage bootstrap/cache`

## License

[MIT License](LICENSE.md)
