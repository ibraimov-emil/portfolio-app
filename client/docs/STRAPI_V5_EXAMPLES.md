# Strapi v5 - Примеры использования

## Основные изменения в структуре данных

### До (Strapi v4)
```typescript
{
  data: {
    id: 1,
    attributes: {
      name: "Название компании",
      description: "Описание",
      photo: {
        data: {
          id: 1,
          attributes: {
            url: "/uploads/image.jpg"
          }
        }
      },
      skills: {
        data: [
          {
            id: 1,
            attributes: {
              name: "React"
            }
          }
        ]
      }
    }
  }
}
```

### После (Strapi v5)
```typescript
{
  data: {
    documentId: "abc123",
    id: 1,
    name: "Название компании",
    description: "Описание",
    photo: [
      {
        documentId: "xyz789",
        id: 1,
        url: "/uploads/image.jpg"
      }
    ],
    skills: [
      {
        documentId: "def456",
        id: 1,
        name: "React"
      }
    ]
  }
}
```

## Примеры компонентов

### 1. Отображение компании

```typescript
// До (v4)
<Image
  src={process.env.NEXT_PUBLIC_API_URL_IMAGE + company.attributes.photo.data[0].attributes.url}
  alt={company.attributes.name}
/>

// После (v5)
<Image
  src={process.env.NEXT_PUBLIC_API_URL_IMAGE + company.photo[0].url}
  alt={company.name}
/>
```

### 2. Работа с локализациями

```typescript
// До (v4)
const hasLocalizations = company.attributes.localizations?.data.length > 0;
const localizedName = company.attributes.localizations.data[0].attributes.name;

// После (v5)
const hasLocalizations = company.localizations?.length > 0;
const localizedName = company.localizations[0].name;
```

### 3. Отображение навыков

```typescript
// До (v4)
{practice.skills?.data.map(skill => (
  <span key={skill.id}>
    {skill.attributes.name}
  </span>
))}

// После (v5)
{practice.skills?.map(skill => (
  <span key={skill.documentId}>
    {skill.name}
  </span>
))}
```

### 4. Использование ID

```typescript
// До (v4)
<Link href={`/company/${company.id}`}>

// После (v5)
<Link href={`/company/${company.documentId}`}>
```

## API запросы

### Получение данных с populate

```typescript
// v5 - populate остается похожим
const { data } = await axiosInstance.get('/companies', {
  params: {
    populate: {
      photo: true,
      localizations: {
        fields: ['name', 'description', 'locale']
      },
      skills: true
    }
  }
});
```

### Создание записи

```typescript
// v5
const payload = {
  data: {
    name: "Новая компания",
    description: "Описание",
    shortDescription: "Краткое описание"
  }
};

const { data } = await axiosInstance.post('/companies', payload);
// data.documentId - используем для дальнейших операций
```

### Обновление записи

```typescript
// v5 - используем documentId
const { data } = await axiosInstance.put(`/companies/${documentId}`, payload);
```

### Загрузка файлов

```typescript
// v5 - формат остается прежним
const formData = new FormData();
formData.append('data', JSON.stringify({}));
formData.append('files.photo', file, file.name);

await axiosInstance.put(`/companies/${documentId}`, formData);
```

## RTK Query примеры

### Получение списка вакансий

```typescript
import { useGetVacanciesQuery } from '@/store/api/vacancies';

function VacanciesList() {
  const { data, isLoading, error } = useGetVacanciesQuery({
    page: 1,
    pageSize: 10,
    filters: {
      isActive: true
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading vacancies</div>;

  return (
    <div>
      {data?.data.map(vacancy => (
        <div key={vacancy.documentId}>
          <h3>{vacancy.title}</h3>
          <p>{vacancy.company?.name}</p>
        </div>
      ))}
    </div>
  );
}
```

### Создание вакансии

```typescript
import { useCreateVacancyMutation } from '@/store/api/vacancies';

function CreateVacancyForm() {
  const [createVacancy, { isLoading }] = useCreateVacancyMutation();

  const handleSubmit = async (formData) => {
    try {
      await createVacancy({
        data: {
          title: formData.title,
          description: formData.description,
          salaryMin: formData.salaryMin,
          salaryMax: formData.salaryMax,
          location: formData.location,
          workFormat: formData.workFormat,
          employmentType: formData.employmentType,
          experienceLevel: formData.experienceLevel,
          isActive: true,
          hot: false,
          contacts: formData.contacts,
          company: formData.companyDocumentId // documentId компании
        }
      }).unwrap();
      
      // Успешно создано
    } catch (err) {
      console.error('Failed to create vacancy:', err);
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Обновление вакансии

```typescript
import { useUpdateVacancyMutation } from '@/store/api/vacancies';

function EditVacancy({ vacancyId }) {
  const [updateVacancy, { isLoading }] = useUpdateVacancyMutation();

  const handleUpdate = async (formData) => {
    try {
      await updateVacancy({
        id: vacancyId, // documentId
        payload: {
          data: {
            title: formData.title,
            isActive: formData.isActive
          }
        }
      }).unwrap();
    } catch (err) {
      console.error('Failed to update:', err);
    }
  };

  return <form onSubmit={handleUpdate}>...</form>;
}
```

### Удаление вакансии

```typescript
import { useDeleteVacancyMutation } from '@/store/api/vacancies';

function DeleteButton({ vacancyId }) {
  const [deleteVacancy, { isLoading }] = useDeleteVacancyMutation();

  const handleDelete = async () => {
    if (confirm('Are you sure?')) {
      try {
        await deleteVacancy(vacancyId).unwrap();
      } catch (err) {
        console.error('Failed to delete:', err);
      }
    }
  };

  return (
    <button onClick={handleDelete} disabled={isLoading}>
      Delete
    </button>
  );
}
```

## Типичные ошибки и решения

### 1. Попытка доступа к attributes
```typescript
// ❌ Неправильно
company.attributes.name

// ✅ Правильно
company.name
```

### 2. Использование id вместо documentId
```typescript
// ❌ Неправильно для API вызовов
await deleteCompany(company.id);

// ✅ Правильно
await deleteCompany(company.documentId);
```

### 3. Неправильный доступ к связанным данным
```typescript
// ❌ Неправильно
company.photo.data[0].attributes.url

// ✅ Правильно
company.photo[0].url
```

### 4. Неправильная работа с массивами
```typescript
// ❌ Неправильно
skills.data.map(skill => skill.attributes.name)

// ✅ Правильно
skills.map(skill => skill.name)
```

## Чеклист миграции компонента

- [ ] Заменить `item.attributes.field` на `item.field`
- [ ] Заменить `relation.data` на прямой доступ к `relation`
- [ ] Использовать `documentId` для API операций
- [ ] Использовать `documentId` в качестве `key` в списках
- [ ] Обновить пути к изображениям (убрать `.data[0].attributes`)
- [ ] Проверить все `map` функции на массивах
- [ ] Обновить типы TypeScript
- [ ] Протестировать CRUD операции