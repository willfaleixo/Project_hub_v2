import { configureStore } from '@reduxjs/toolkit';
import themeReducer from '../features/themeSlice';
import workspaceReducer from '../features/workspaceSlice';
import languageReducer from '../features/languageSlice';
import projectReducer from '../features/projectSlice';
import notificationReducer from '../features/notificationSlice';
import approvalReducer from '../features/approvalSlice';
import authReducer from '../features/authSlice';
import wikiReducer from '../features/wikiSlice';
import dashboardFilterReducer from '../features/dashboardFilterSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    workspace: workspaceReducer,
    language: languageReducer,
    projects: projectReducer,
    notifications: notificationReducer,
    approvals: approvalReducer,
    auth: authReducer,
    wiki: wikiReducer,
    dashboardFilter: dashboardFilterReducer,
  },
});