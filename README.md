# SeQura Backend Challenge

A backend service that processes merchant disbursements, built with modern technologies and following Domain-Driven Design principles.

## Technologies & Packages

### Core Technologies
- **TypeScript**: Programming language for type-safe code
- **Node.js**: JavaScript runtime (v18+)
- **NestJS**: Progressive Node.js framework for building scalable applications
- **MongoDB**: NoSQL database for data persistence

### Main Dependencies
- **@nestjs/common**: Core NestJS framework
- **@nestjs/config**: Configuration management
- **@nestjs/mongoose**: MongoDB integration for NestJS
- **mongoose**: MongoDB object modeling tool
- **dayjs**: Modern date manipulation library
- **nest-commander**: CLI command creation for NestJS
- **class-validator**: Decorator-based validation
- **class-transformer**: Object transformation and serialization

### Development Dependencies
- **Jest**: Testing framework
- **ts-jest**: TypeScript support for Jest
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **ts-node**: TypeScript execution environment

## Project Architecture

The project follows a Domain-Driven Design (DDD) approach with a hexagonal architecture pattern, organized into distinct modules:

```
src/
├── modules/
│   ├── disbursements/      # Disbursements module
│   │   ├── application/    # Use cases and DTOs
│   │   ├── domain/        # Entities, Value Objects, Repositories (interfaces)
│   │   └── infrastructure/ # Concrete implementations (MongoDB, commands)
│   ├── merchants/          # Merchants module
│   │   ├── application/
│   │   ├── domain/
│   │   └── infrastructure/
│   └── orders/             # Orders module
│       ├── application/
│       ├── domain/
│       └── infrastructure/
```

## Core Features

### 1. Disbursement Processing
- Automated disbursement calculation for merchants
- Support for daily and weekly disbursement frequencies
- Fee calculation based on order amounts
- Date range management for disbursement periods

### 2. Merchant Management
- Merchant profile handling
- Disbursement frequency configuration
- Minimum monthly fee tracking

### 3. Order Processing
- Order status tracking (PENDING/DISBURSED)
- Order amount validation
- Merchant association

## Domain Model

### Disbursements
```typescript
{
  id: string;
  merchantId: string;
  amount: number;
  fee: number;
  reference: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
}
```

### Merchants
```typescript
{
  id: string;
  reference: string;
  email: string;
  liveOn: Date;
  disbursementFrequency: 'DAILY' | 'WEEKLY';
  minimumMonthlyFee: number;
}
```

### Orders
```typescript
{
  id: string;
  merchantId: string;
  amount: number;
  status: 'PENDING' | 'DISBURSED';
  createdAt: Date;
  updatedAt: Date;
}
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- npm or yarn

### Installation
```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
npm install

# Configure environment
cp .env.example .env
```

### Configuration
Required environment variables:
- `MONGODB_URI`: MongoDB connection string
- `PORT`: Application port (default: 3000)
- `NODE_ENV`: Environment (development/production)

## Available Commands

### Disbursement Processing
```bash
# Process daily disbursements
npm run cli process-disbursement --frequency DAILY

# Process weekly disbursements
npm run cli process-disbursement --frequency WEEKLY

# Using short form
npm run cli process-disbursement -f DAILY
```

### Development
```bash
# Run in development mode
npm run start:dev

# Run tests
npm test

# Run tests with coverage
npm run test:cov

# Lint code
npm run lint

# Format code
npm run format
```

### Data Processing Scripts
```bash
# Process orders CSV file
npx ts-node scripts/process_orders.ts
```

## Design Patterns

### 1. Value Objects
Immutable objects that encapsulate domain concepts:
- `Amount`: Safe money handling
- `Fee`: Fee calculation logic
- `Reference`: Unique reference generation

### 2. Strategy Pattern
Used for implementing varying algorithms:
- `GetDateRangesByFrequencyStrategy`: Date range calculations based on frequency

### 3. Repository Pattern
Data access abstraction:
- `DisbursementRepository`
- `MerchantRepository`
- `OrderRepository`

## Testing Strategy

The project implements various types of tests:

1. **Unit Tests**: Testing individual components in isolation
2. **Integration Tests**: Testing component interactions
3. **E2E Tests**: Testing complete features

Run tests using:
```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:cov
```


## How It Was Done

The project began with the definition of the main entities, establishing their properties and data structures following a **Domain-Driven Design (DDD)** architecture. To achieve this, the application was divided into modules according to their respective domains.

During development, new domain requirements emerged, leading to the creation of **Value Objects** and additional validations. To model the entities, I used the example tables of **orders** and **merchants** provided in the challenge, though I later added some additional properties that I deemed necessary.

After defining the entities, I identified the **key use cases** needed to meet the project’s objectives.

I aimed to maintain the **Single Responsibility Principle (SRP)** throughout the development process to ensure that the code remained **maintainable, modular, and easily testable**.

The project was built using **NestJS**, ensuring a clear separation between the domain logic (entities, services, use cases) and the infrastructure (controllers, persistence). Additionally, I implemented controllers to **expose endpoints for creating and querying entities**.

---

## Challenges

During the development process, I encountered several challenges:

1. **Lack of initial entity definitions:**
   - At times, I had to reassess the data structure and adjust entities due to missing aspects in the initial design phase.
   
2. **Creation of unnecessary use cases:**
   - Early in the project, I implemented some use cases that I later realized were not needed, leading to additional work and some delays.

3. **Managing modularity in NestJS:**
   - While NestJS’s modular structure was useful, combining it with DDD resulted in a **large number of nested files and folders**, making code navigation and management more complex.

---

## Areas for Improvement

Although I aimed to maintain **high-quality standards**, due to time constraints, I had to prioritize project delivery. However, there are several areas that could be improved:

1. **Optimizing use cases and repository methods:**
   - Review and remove unnecessary use cases and repository methods to streamline the project.

2. **Enhancing the disbursement process:**
   - The current implementation is **heavy and inefficient**, which could be improved using better strategies (see proposals below).

3. **Refining the modular structure:**
   - While modularity in NestJS is beneficial, when combined with DDD, it can result in **excessive fragmentation and unnecessary dependencies between modules**.
   - A better approach might involve consolidating some modules or managing dependencies in a more structured way.

---

## Disbursement Process Optimization

The process of generating disbursements is a critical part of the system.

Initially, I proposed executing this use case via a **cron job** at scheduled intervals. However, a better strategy would be to run the process **independently from the main application**, such as by using **commands in separate instances**.

This approach would:

✅ **Prevent blocking the main application thread.**  
✅ **Avoid duplicate execution of the process.**  
✅ **Reduce the risk of race conditions.**  

---

## Improvement Proposals

1. **Migrate the disbursement system to an event-driven execution model**
   - Instead of executing the entire disbursement calculation in a single heavy operation, domain **events** could be used to process disbursements **incrementally and in a distributed manner**.
   - For example, when a new order is created, an event could be triggered to check whether a disbursement is needed for the given time range and orders.

2. **Optimize the modular architecture**
   - Assess whether all current modules are necessary or if some can be consolidated to reduce excessive file fragmentation.
   - Consider moving some dependencies to **shared services** instead of separate modules.



