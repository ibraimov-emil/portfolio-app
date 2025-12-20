# Strapi v4 to v5 Migration Guide

## Overview

This document outlines the changes made to migrate from Strapi v4 to v5.

## Key Changes

### 1. Response Structure

Strapi v5 uses a flat structure instead of nested `attributes`:

#### Before (v4)
```typescript
{
  data: {
    id: 1,
    attributes: {
      name: "Company Name",
      description: "Description",
      photo: {
        data: {
          id: 1,
          attributes: {
            url: "/uploads/image.jpg"
          }
        }
      }
    }
  }
}
```

#### After (v5)
```typescript
{
  data: {
    documentId: "abc123def456",
    id: 1,
    name: "Company Name",
    description: "Description",
    photo: [
      {
        documentId: "xyz789",
        id: 1,
        url: "/uploads/image.jpg"
      }
    ]
  }
}
```

### 2. Document ID

- Strapi v5 introduces `documentId` as the primary identifier
- `id` is still present but `documentId` should be used for API calls
- `documentId` is a string, while `id` is a number

### 3. Relations

Relations are now returned as flat arrays instead of nested `data.attributes`:

```typescript
// v4
company: {
  data: {
    id: 1,
    attributes: { name: "Company" }
  }
}

// v5
company: {
  documentId: "abc123",
  id: 1,
  name: "Company"
}
```

### 4. Populate Syntax

The populate syntax remains similar but returns flat structures:

```typescript
params: {
  populate: {
    photo: true,
    company: {
      fields: ['name', 'description'],
      populate: { photo: true }
    }
  }
}
```

### 5. File Uploads

File upload format remains the same:

```typescript
const formData = new FormData();
formData.append('data', JSON.stringify({}));
formData.append('files.photo', file, file.name);
```

## Updated Types

### General Types (`types/general.ts`)
- `Photo` - Updated to flat structure
- `Meta` - Unchanged
- `Pagination` - Unchanged

### Skill Types (`types/skill.ts`)
- `SkillItem` - Now uses flat structure with `documentId`
- Removed nested `attributes`

### Company Types (`types/company.ts`)
- `CompanyItem` - Flat structure with `documentId`
- `CompanyLocalization` - Updated for v5 localizations
- Added `locale` field

### Vacancy Types (`types/vacancy.ts`)
- `VacancyItem` - Flat structure with `documentId`
- Added payload types for create/update operations
- Relations are now direct objects instead of nested

### Practice Types (`types/practice.ts`)
- `PracticeItem` - Flat structure with `documentId`
- Relations updated to flat arrays

## RTK Query Implementation

### Setup

1. **Store Configuration** (`store/index.ts`)
   - Configured Redux store with RTK Query
   - Added vacancies API reducer and middleware

2. **Vacancies API** (`store/api/vacancies.ts`)
   - Full CRUD operations
   - Automatic cache invalidation
   - Optimistic updates support

### Available Hooks

```typescript
// Queries
useGetVacanciesQuery({ page, pageSize, filters, populate })
useGetVacancyByIdQuery(documentId)

// Mutations
useCreateVacancyMutation()
useUpdateVacancyMutation()
useDeleteVacancyMutation()
useUploadVacancyPhotoMutation()
```

### Usage Example

```typescript
'use client';

import { useGetVacanciesQuery, useCreateVacancyMutation } from '@/store/api/vacancies';

export default function VacanciesPage() {
  const { data, isLoading, error } = useGetVacanciesQuery({ 
    page: 1, 
    pageSize: 10 
  });
  
  const [createVacancy, { isLoading: isCreating }] = useCreateVacancyMutation();

  const handleCreate = async (formData) => {
    try {
      await createVacancy({
        data: {
          title: formData.title,
          description: formData.description,
          // ... other fields
        }
      }).unwrap();
    } catch (err) {
      console.error('Failed to create vacancy:', err);
    }
  };

  // ... rest of component
}
```

## Migration Checklist

- [x] Update all type definitions to flat structure
- [x] Add `documentId` field to all entity types
- [x] Update API service functions to use `documentId`
- [x] Remove nested `attributes` from types
- [x] Update relations to flat structure
- [x] Implement RTK Query for vacancies
- [x] Add Redux Provider to app
- [x] Create example components using RTK Query
- [ ] Update remaining components to use new types
- [ ] Test all CRUD operations
- [ ] Update forms to use new payload structures

## Breaking Changes

1. **ID Changes**: Use `documentId` instead of `id` for API calls
2. **Type Structure**: All `attributes` nesting removed
3. **Relations**: Relations are now direct objects/arrays
4. **Localizations**: Structure changed for localization data

## Best Practices

1. Always use `documentId` for API operations
2. Use RTK Query for data fetching when possible
3. Leverage automatic cache invalidation
4. Use TypeScript types for type safety
5. Handle loading and error states properly

## Resources

- [Strapi v5 Documentation](https://docs.strapi.io/dev-docs/migration/v4-to-v5)
- [RTK Query Documentation](https://redux-toolkit.js.org/rtk-query/overview)
- [Next.js Documentation](https://nextjs.org/docs)