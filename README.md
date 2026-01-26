# NestJS Boilerplate

## Overview
This codebase is a boilerplate for developing backend services using the NestJS framework. It is structured to manage user authentication, utilize OpenTelemetry for monitoring, and apply database interactions through TypeORM, while also auto-generating API documentation via Swagger.

## Directory Structure

### 1. `src/common/`
Contains shared resources used across the application:
- **DTOs (Data Transfer Objects)**: Structures for data transfer.
- **Entities**: Base entities for data models.
- **Enums**: Enumerations for standardized constants.
- **Interfaces**: Contracts for data and service structures.
- **Messages**: Common message texts used throughout the app.

### 2. `src/configs/`
Holds configuration-related files:
- **Configuration Modules**: Manages application-level configurations.
- **Database Configuration**: Contains setup files using YAML configurations.
  
### 3. `src/core/`
Contains core functionalities such as:
- **API**: Base setup and services.
- **Decorators**: Custom decorators.
- **Exceptions & Filters**: For global exception handling.
- **Logging**: Using Winston.
- **Middlewares, Pipes, Guards, Interceptors**: Security, validation, and request/response handling.
- **Storage**: File storage logic.
- **Utils**: Utility functions and helpers.

### 4. `src/database/`
Handles database logic:
- **Migrations**: Database schema migrations.
- **Seeders**: Initial data seeding scripts.

### 5. `src/health/`
Manages application health checks to ensure service availability.

### 6. `src/modules/`
Holds application features and business logic:
- **Auth Module**: For authentication.
- **Users Module**: User management logic, including submodules.

### 7. `src/opentelemetry/`
Integration with OpenTelemetry:
- For metrics and tracing configurations.

### 8. `test/`
Contains testing files:
- **End-to-End Tests**: To validate application flows.
- **Configurations**: For testing tools like Jest.

## Prerequisites
- **Node.js**: Ensure Node.js is installed.
- **Docker**: Optional, for container-based running environments.

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd nestjs-boilerplate
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Database Configuration**
   - Configure your database in `src/configs/database/datasource.ts`.

4. **Configuration**
   - Application configuration is managed via YAML files located in `src/configs/yaml/`.

5. **Running Migrations**
   ```bash
   NODE_ENV=<environment> npm run migration:run
   ```

6. **Start the Application**
   - For development:
     ```bash
     npm run start:local
     ```
   - For production:
     ```bash
     npm run start:prod
     ```

## Code Quality and Linting
Use ESLint and Prettier to maintain high code quality.

- **Linting**
  ```bash
  npm run lint
  ```
- **Formatting**
  ```bash
  npm run format
  ```

## VSCode Extensions
For improved development experience, install these VSCode extensions:
1. **ESLint** - For linting.
2. **Prettier - Code formatter** - Consistent code formatting.
3. **YAML** - Syntax support for YAML.

## Testing
- **Run Tests**: `npm test`
- **Coverage**: `npm run test:cov`

## API Documentation
Access Swagger documentation at: `http://localhost:<port>/api-docs`.

## Logging
Adjust logging via configurations in `WinstonLoggerService`.

## Monitoring
OpenTelemetry is configured in `src/opentelemetry/`.

## Deployment
Utilize the `Dockerfile` and `docker-compose.yml` for containerization.

This README offers a comprehensive overview to assist developers in understanding and utilizing this boilerplate for building NestJS applications effectively. Let me know if there's more you'd like to add or modify!