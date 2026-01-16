# Story 1.3: Set Up Nest.js Backend in apps/api

Status: ready-for-dev

## Story

As a **developer**,
I want **a Nest.js backend configured in `apps/api/`**,
So that **I can build RESTful APIs for the TrickTrack platform**.

## Acceptance Criteria

1. **Given** the monorepo is initialized
   **When** I run `pnpm dev` in `apps/api/`
   **Then** Nest.js dev server starts on `http://localhost:3001`
   **And** the API includes module-based architecture, Swagger/OpenAPI docs, validation, configuration, CORS, and testing setup

## Tasks / Subtasks

- [ ] Initialize Nest.js application (AC: 1)
  - [ ] Navigate to `apps/api/` directory
  - [ ] Run `pnpm dlx @nestjs/cli new . --package-manager pnpm --skip-git`
  - [ ] Verify Nest.js installation with TypeScript
  - [ ] Test dev server starts on port 3001
- [ ] Configure Swagger/OpenAPI documentation (AC: 1)
  - [ ] Install `@nestjs/swagger` and `swagger-ui-express`
  - [ ] Configure Swagger in `main.ts`
  - [ ] Set up API documentation at `/api/docs`
  - [ ] Add API versioning (`/api/v1/`)
- [ ] Set up validation and transformation (AC: 1)
  - [ ] Install `class-validator` and `class-transformer`
  - [ ] Configure global validation pipe
  - [ ] Set up DTO validation
  - [ ] Add transform options for type safety
- [ ] Configure environment variables (AC: 1)
  - [ ] Install `@nestjs/config`
  - [ ] Create `.env.example` file
  - [ ] Set up ConfigModule with validation
  - [ ] Add environment-specific configs
- [ ] Set up CORS configuration (AC: 1)
  - [ ] Configure CORS in `main.ts`
  - [ ] Allow Next.js frontend origin (localhost:3000)
  - [ ] Set up credentials and headers
  - [ ] Configure for production domains
- [ ] Create base module structure (AC: 1)
  - [ ] Create `src/auth/` module (placeholder)
  - [ ] Create `src/users/` module (placeholder)
  - [ ] Create `src/validations/` module (placeholder)
  - [ ] Create `src/common/` for shared utilities
- [ ] Set up testing infrastructure (AC: 1)
  - [ ] Verify Jest configuration
  - [ ] Create test utilities and fixtures
  - [ ] Set up e2e testing with supertest
  - [ ] Add test scripts to package.json
- [ ] Configure TypeScript and ESLint (AC: 1)
  - [ ] Verify `tsconfig.json` with strict mode
  - [ ] Configure ESLint with Nest.js plugin
  - [ ] Add path aliases for clean imports
  - [ ] Test TypeScript compilation
- [ ] Verify API functionality
  - [ ] Test health check endpoint
  - [ ] Verify Swagger docs load at `/api/docs`
  - [ ] Test CORS with frontend origin
  - [ ] Run test suite successfully

## Dev Notes

### Architecture Requirements

**Backend Framework:** Nest.js (from `@architecture.md`)

**Key Features:**
- **Architecture:** Module-based with dependency injection
- **Testing:** Jest with supertest for e2e tests
- **Validation:** class-validator + class-transformer
- **Configuration:** @nestjs/config for environment variables
- **API Documentation:** Swagger/OpenAPI
- **API Versioning:** URL-based (`/api/v1/`)

**Performance Requirements:**
- Validation submission: < 2 seconds (NFR2)
- Database queries: < 1 second at 1M records (NFR18)
- 99.5% platform uptime (NFR23)

### Nest.js Configuration

**Installation Command:**
```bash
cd apps/api
pnpm dlx @nestjs/cli new . --package-manager pnpm --skip-git
```

**main.ts Configuration:**
```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // CORS configuration
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('TrickTrack API')
    .setDescription('TrickTrack skateboarding validation platform API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT || 3001);
}
bootstrap();
```

**package.json Scripts:**
```json
{
  "scripts": {
    "dev": "nest start --watch",
    "build": "nest build",
    "start": "node dist/main",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix"
  }
}
```

### Module Structure

**Directory Layout:**
```
apps/api/
├── src/
│   ├── auth/                # Authentication module (placeholder)
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   ├── users/               # Users module (placeholder)
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   ├── validations/         # Validations module (placeholder)
│   │   ├── validations.controller.ts
│   │   ├── validations.service.ts
│   │   └── validations.module.ts
│   ├── common/              # Shared utilities
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── pipes/
│   ├── app.controller.ts
│   ├── app.service.ts
│   ├── app.module.ts
│   └── main.ts
├── test/
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── .env.example
├── nest-cli.json
├── tsconfig.json
└── package.json
```

### Environment Configuration

**.env.example:**
```env
# Server
PORT=3001
NODE_ENV=development

# Frontend
FRONTEND_URL=http://localhost:3000

# Database (Supabase - to be configured later)
DATABASE_URL=

# JWT (to be configured later)
JWT_SECRET=
JWT_EXPIRATION=7d

# Blockchain (to be configured later)
ALCHEMY_POLYGON_URL=
INFURA_POLYGON_URL=
```

**ConfigModule Setup (app.module.ts):**
```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### API Structure

**Planned Endpoints (from `@architecture.md`):**
```
/api/v1/auth          - Authentication endpoints
/api/v1/users         - User profile management
/api/v1/validations   - Validation request/response
/api/v1/tokens        - Token balance and history
/api/v1/nfts          - NFT badge queries
/api/v1/dao           - DAO proposals and voting
/api/v1/challenges    - Sponsor challenges
/api/v1/admin         - Admin operations
```

### Testing Requirements

**Verification Steps:**
1. Run `pnpm dev` - dev server starts on port 3001
2. Visit `http://localhost:3001/api/v1` - health check responds
3. Visit `http://localhost:3001/api/docs` - Swagger UI loads
4. Run `pnpm test` - unit tests pass
5. Run `pnpm test:e2e` - e2e tests pass
6. Test CORS - frontend can make requests

**Success Criteria:**
- Nest.js dev server runs without errors
- Swagger documentation is accessible
- CORS is configured correctly
- Validation pipe works globally
- Module structure is set up
- Tests pass successfully

### Dependencies

**Story 1.1** - Monorepo must be initialized

### References

- [Source: `@architecture.md` - Backend (Nest.js)]
- [Source: `@architecture.md` - API & Communication Patterns]
- [Source: `@stories-epic-01-foundation.md` - Story 1.3]
- [Nest.js Documentation](https://docs.nestjs.com/)
- [Swagger/OpenAPI Documentation](https://swagger.io/docs/)

## Dev Agent Record

### Agent Model Used

Cascade (Windsurf IDE)

### Debug Log References

### Completion Notes List

### File List

