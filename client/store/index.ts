import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { vacanciesApi } from './api/vacancies';

import { companiesApi } from './api/companies';

export const store = configureStore({
  reducer: {
    [vacanciesApi.reducerPath]: vacanciesApi.reducer,
    [companiesApi.reducerPath]: companiesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(vacanciesApi.middleware, companiesApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;