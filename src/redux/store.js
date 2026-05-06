// Library imports
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';

// Local imports
import authSlice from './features/auth/authSlice';
import signupSlice from './features/auth/signupSlice';
import membershipSlice from './features/membership/membershipSlice';
import snackbarReducer from './features/snackbarSlice/snackbarSlice';
import templatesReducer from './features/templates/templatesSlice';
import learningHubReducer from './features/learningHub/learningHubSlice';
import profileContextReducer from './features/profileContext/profileContextSlice';
import teacherIdentityReducer from './features/teacherIdentity/teacherIdentitySlice';
import learningProgressReducer from './features/learningProgress/learningProgressSlice';
import learningHubAdminReducer from './features/learningHubAdmin/learningHubAdminSlice';
import personalizationReducer from './features/personalization/personalizationSlice';
import subscriptionReducer from './features/subscription/subscriptionSlice';
import preferencesReducer from './features/preferences/preferencesSlice';
import { quizApiSlice } from './features/teacherTools/quiz/quizApiSlice';
import { assignmentApiSlice } from './features/teacherTools/assignment/assignmentApiSlice';
import { worksheetApiSlice } from './features/teacherTools/worksheet/worksheetApiSlice';
import { statsApiSlice } from './features/teacherTools/stats/statsApiSlice';
import { analyticsApiSlice } from './features/teacherTools/analytics/analyticsApiSlice';
import { contentRegistryApiSlice } from './features/contentRegistry/contentRegistryApiSlice';
import { historyApiSlice } from './features/history/historyApiSlice';

const storage =
  typeof window !== 'undefined'
    ? {
        getItem: (key) => Promise.resolve(window.localStorage.getItem(key)),
        setItem: (key, value) => {
          window.localStorage.setItem(key, value);
          return Promise.resolve(value);
        },
        removeItem: (key) => {
          window.localStorage.removeItem(key);
          return Promise.resolve();
        },
      }
    : {
        getItem: () => Promise.resolve(null),
        setItem: (_key, value) => Promise.resolve(value),
        removeItem: () => Promise.resolve(),
      };

// Define the persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'preferences'],
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authSlice,
  signup: signupSlice,
  membership: membershipSlice,
  snackbar: snackbarReducer,
  templates: templatesReducer,
  learningHub: learningHubReducer,
  profileContext: profileContextReducer,
  teacherIdentity: teacherIdentityReducer,
  learningProgress: learningProgressReducer,
  learningHubAdmin: learningHubAdminReducer,
  personalization: personalizationReducer,
  subscription: subscriptionReducer,
  preferences: preferencesReducer,
  [quizApiSlice.reducerPath]: quizApiSlice.reducer,
  [assignmentApiSlice.reducerPath]: assignmentApiSlice.reducer,
  [worksheetApiSlice.reducerPath]: worksheetApiSlice.reducer,
  [statsApiSlice.reducerPath]: statsApiSlice.reducer,
  [analyticsApiSlice.reducerPath]: analyticsApiSlice.reducer,
  [contentRegistryApiSlice.reducerPath]: contentRegistryApiSlice.reducer,
  [historyApiSlice.reducerPath]: historyApiSlice.reducer,
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store with the persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      quizApiSlice.middleware,
      assignmentApiSlice.middleware,
      worksheetApiSlice.middleware,
      statsApiSlice.middleware,
      analyticsApiSlice.middleware,
      contentRegistryApiSlice.middleware,
      historyApiSlice.middleware,
    ),
});

// Create a persistor
export const persistor = persistStore(store);

// Set store reference in http.js for axios interceptor
// This allows axios to access Redux state for auth token
import { setStoreReference } from './http';
setStoreReference(store);

// Set store reference in api/client.ts for fetch API client
// This allows the new API client to access Redux state for auth token (same as axios)
import { setStoreReference as setApiClientStoreReference } from '../api/client';
setApiClientStoreReference(store);

// Set store reference in formatting helpers (locale/timezone-aware formatters)
import { setFormatStoreReference } from '../lib/i18n/format'
setFormatStoreReference(store)
