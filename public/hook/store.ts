import { configureStore ,Middleware } from '@reduxjs/toolkit'
import rootReducer from '../reducers/rootReducer';
import { createLogger } from 'redux-logger'

const middlewares: Middleware[] = [];

// middlewares.push(thunk)
if (`${process.env.NODE_ENV}` === 'development') {
  const logger:any = createLogger({
    // ...options
  });
  middlewares.push(logger);
}

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
  getDefaultMiddleware({
    serializableCheck: false
  }).concat(middlewares)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch