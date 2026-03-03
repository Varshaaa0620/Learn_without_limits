import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth APIs
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me')
};

// Course APIs
export const courseAPI = {
  getAll: () => api.get('/courses'),
  getById: (id) => api.get(`/courses/${id}`),
  getLessons: (id) => api.get(`/courses/${id}/lessons`)
};

// Lesson APIs
export const lessonAPI = {
  getById: (id) => api.get(`/lessons/${id}`),
  getAdjacent: (id) => api.get(`/lessons/${id}/adjacent`)
};

// Enrollment APIs
export const enrollmentAPI = {
  enroll: (courseId) => api.post('/enrollments', { course_id: courseId }),
  getMyEnrollments: () => api.get('/enrollments/my-courses'),
  checkEnrollment: (courseId) => api.get(`/enrollments/check/${courseId}`)
};

// Progress APIs
export const progressAPI = {
  markComplete: (lessonId) => api.post('/progress', { lesson_id: lessonId }),
  getCourseProgress: (courseId) => api.get(`/progress/${courseId}`),
  getCompletedLessons: (courseId) => api.get(`/progress/completed/${courseId}`)
};

export default api;
