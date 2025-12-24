export const API_URL = 'http://127.0.0.1:8000/api';

export const ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  
  // Users
  USERS: '/users',
  
  // Surveys
  SURVEYS: '/surveys',
  
  // Questions
  QUESTIONS: '/questions',
  
  // Responses
  RESPONSES: '/responses',
  
  // Answers
  ANSWERS: '/answers',
  
  // Analytics
  ANALYTICS: '/survey-analytics',
};

export const ROLES = {
  ADMIN: 'admin',
  RESPONDEN: 'responden',
};
