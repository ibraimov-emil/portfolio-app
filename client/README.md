# Client Application

This is a Next.js application with TypeScript, Tailwind CSS, and shadcn/ui components.

## Strapi v5 Migration

The application has been updated to work with Strapi v5. Key changes:

### Type Structure Changes

Strapi v5 uses a flat structure instead of nested `attributes`:

**Before (v4):**
```typescript
{
  data: {
    id: 1,
    attributes: {
      name: "Example",
      createdAt: "2024-01-01"
    }
  }
}
```

**After (v5):**
```typescript
{
  data: {
    documentId: "abc123",
    id: 1,
    name: "Example",
    createdAt: "2024-01-01"
  }
}
```

### Updated Types

All types have been updated to match Strapi v5 structure:
- `SkillItem` - Skills with flat structure
- `PracticeItem` - Practice items with flat structure
- `CompanyItem` - Companies with flat structure
- `VacancyItem` - Vacancies with flat structure

### RTK Query Implementation

Vacancies CRUD operations are now implemented using RTK Query:

```typescript
import { 
  useGetVacanciesQuery,
  useGetVacancyByIdQuery,
  useCreateVacancyMutation,
  useUpdateVacancyMutation,
  useDeleteVacancyMutation,
  useUploadVacancyPhotoMutation
} from '@/store/api/vacancies';

// Example usage
function VacanciesList() {
  const { data, isLoading } = useGetVacanciesQuery({ page: 1, pageSize: 10 });
  const [createVacancy] = useCreateVacancyMutation();
  
  // ... component logic
}
```

### API Changes

- Use `documentId` instead of `id` for identifying resources
- Populate syntax remains similar but returns flat structures
- File uploads still use `files.{fieldName}` format

## Development

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.