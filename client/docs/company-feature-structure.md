# Company Feature Structure

## Overview
This document describes the organization of the company management feature, following senior-level architecture patterns.

## Architecture

### 1. Data Layer (`/services`)
- **company.ts**: API service functions
  - `getCompanies()` - Fetch all companies
  - `getCompanyById()` - Fetch single company
  - `createCompany()` - Create new company
  - `updateCompany()` - Update existing company
  - `deleteCompany()` - Delete company
  - `uploadCompanyPhoto()` - Upload company photo

### 2. State Management (`/hooks`)
- **use-company-mutations.ts**: React Query mutations
  - `useCreateCompany()` - Create mutation with cache invalidation
  - `useUpdateCompany()` - Update mutation with cache invalidation
  - `useDeleteCompany()` - Delete mutation with cache invalidation

### 3. Validation Layer (`/lib/validations`)
- **company.ts**: Zod schemas
  - `companyFormSchema` - Form validation rules
  - `CompanyFormValues` - TypeScript type inference

### 4. Type Definitions (`/types`)
- **company.ts**: TypeScript interfaces
  - `CompanyItem` - Company entity
  - `CompaniesCombine` - Companies list response
  - `CompanyFormData` - Form data structure
  - `CompanyCreatePayload` - API payload structure

### 5. UI Components (`/app/(main)/practice/tanstack/company`)

#### Pages
- **create/page.tsx** - Create company page
- **[id]/page.tsx** - Company detail page
- **[id]/edit/page.tsx** - Edit company page

#### Components
- **create/_components/company-form.tsx** - Create form (uses `useCreateCompany`)
- **[id]/edit/_components/company-edit-form.tsx** - Edit form (uses `useUpdateCompany`)
- **[id]/_components/company-actions.tsx** - Edit/Delete actions (uses `useDeleteCompany`)

## Key Features

### React Query Integration
- All mutations use TanStack Query for:
  - Automatic loading states (`isPending`)
  - Error handling
  - Cache invalidation
  - Optimistic updates support

### Form Handling
- React Hook Form with Zod validation
- Type-safe form values
- Automatic error messages
- File upload support

### User Experience
- Toast notifications for success/error
- Loading states with spinners
- Confirmation dialogs for destructive actions
- Automatic navigation after operations

## Data Flow

```
User Action → Form Submit → Mutation Hook → API Service → Backend
                                ↓
                        Cache Invalidation
                                ↓
                        UI Update + Toast + Navigation
```

## Benefits of This Architecture

1. **Separation of Concerns**: Each layer has a single responsibility
2. **Type Safety**: Full TypeScript coverage from API to UI
3. **Reusability**: Hooks can be used in multiple components
4. **Testability**: Each layer can be tested independently
5. **Maintainability**: Clear structure makes changes easier
6. **Performance**: React Query handles caching and deduplication
7. **User Experience**: Automatic loading states and error handling