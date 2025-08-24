# Sprobe Demo Application

This is a Laravel application with React frontend, using Docker for development environment.

## Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- Git

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/HENERALPEPITO/sprobe-demo.git
cd sprobe-demo
```

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

## Troubleshooting

1. If you encounter database connection issues:
   - Ensure MySQL container is running: `docker-compose ps`
   - Check MySQL logs: `docker-compose logs db`
   - Verify database credentials in `.env`

2. If the application shows a blank page:
   - Check if frontend assets are built: Run `npm run build`
   - Check Laravel logs: `docker-compose exec app php artisan logs`

3. For permission issues:
   - Fix storage permissions: `docker-compose exec app chown -R www-data:www-data storage bootstrap/cache`

## Contributing

1. Create a new branch
2. Make your changes
3. Submit a pull request

## License

[MIT License](LICENSE.md)
