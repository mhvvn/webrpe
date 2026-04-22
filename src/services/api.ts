const API_BASE_URL = '/api';

// Token Management
const getAccessToken = () => localStorage.getItem('accessToken');
const getRefreshToken = () => localStorage.getItem('refreshToken');
const setTokens = (accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
};
const clearTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('currentUser');
};

// Refresh Token Logic
const refreshAccessToken = async (): Promise<string | null> => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return null;

    try {
        const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
        });

        if (res.ok) {
            const data = await res.json();
            localStorage.setItem('accessToken', data.accessToken);
            return data.accessToken;
        } else {
            clearTokens();
            return null;
        }
    } catch {
        clearTokens();
        return null;
    }
};

// Generic Fetch with Auth
const fetchWithAuth = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
    let token = getAccessToken();

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    // Merge any additional headers from options
    if (options.headers) {
        Object.assign(headers, options.headers);
    }

    let res = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });

    // If 401, try refreshing the token
    if (res.status === 401 && getRefreshToken()) {
        const newToken = await refreshAccessToken();
        if (newToken) {
            headers.Authorization = `Bearer ${newToken}`;
            res = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
        }
    }

    return res;
};

// API Methods
export const api = {
    // Auth
    login: async (username: string, password: string) => {
        const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Login failed');
        }

        const data = await res.json();
        setTokens(data.accessToken, data.refreshToken);
        return data;
    },

    logout: () => {
        clearTokens();
    },

    getMe: async () => {
        const res = await fetchWithAuth('/auth/me');
        if (!res.ok) throw new Error('Failed to get user');
        return res.json();
    },

    // Users
    getUsers: async () => {
        const res = await fetchWithAuth('/users');
        if (!res.ok) throw new Error('Failed to fetch users');
        return res.json();
    },

    createUser: async (user: any) => {
        const res = await fetchWithAuth('/users', {
            method: 'POST',
            body: JSON.stringify(user),
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Failed to create user');
        }
        return res.json();
    },

    updateUser: async (id: string, user: any) => {
        const res = await fetchWithAuth(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(user),
        });
        if (!res.ok) throw new Error('Failed to update user');
        return res.json();
    },

    deleteUser: async (id: string) => {
        const res = await fetchWithAuth(`/users/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete user');
        return res.json();
    },

    // News
    getNews: async () => {
        const res = await fetch(`${API_BASE_URL}/news`);
        if (!res.ok) throw new Error('Failed to fetch news');
        return res.json();
    },

    getNewsById: async (id: string) => {
        const res = await fetch(`${API_BASE_URL}/news/${id}`);
        if (!res.ok) throw new Error('Failed to fetch news');
        return res.json();
    },

    createNews: async (news: any) => {
        const res = await fetchWithAuth('/news', {
            method: 'POST',
            body: JSON.stringify(news),
        });
        if (!res.ok) throw new Error('Failed to create news');
        return res.json();
    },

    updateNews: async (id: string, news: any) => {
        const res = await fetchWithAuth(`/news/${id}`, {
            method: 'PUT',
            body: JSON.stringify(news),
        });
        if (!res.ok) throw new Error('Failed to update news');
        return res.json();
    },

    deleteNews: async (id: string) => {
        const res = await fetchWithAuth(`/news/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete news');
        return res.json();
    },

    // Lecturers
    getLecturers: async () => {
        const res = await fetch(`${API_BASE_URL}/lecturers`);
        if (!res.ok) throw new Error('Failed to fetch lecturers');
        return res.json();
    },

    createLecturer: async (lecturer: any) => {
        const res = await fetchWithAuth('/lecturers', {
            method: 'POST',
            body: JSON.stringify(lecturer),
        });
        if (!res.ok) throw new Error('Failed to create lecturer');
        return res.json();
    },

    updateLecturer: async (id: string, lecturer: any) => {
        const res = await fetchWithAuth(`/lecturers/${id}`, {
            method: 'PUT',
            body: JSON.stringify(lecturer),
        });
        if (!res.ok) throw new Error('Failed to update lecturer');
        return res.json();
    },

    deleteLecturer: async (id: string) => {
        const res = await fetchWithAuth(`/lecturers/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete lecturer');
        return res.json();
    },

    // Facilities
    getFacilities: async () => {
        const res = await fetch(`${API_BASE_URL}/facilities`);
        if (!res.ok) throw new Error('Failed to fetch facilities');
        return res.json();
    },

    createFacility: async (facility: any) => {
        const res = await fetchWithAuth('/facilities', {
            method: 'POST',
            body: JSON.stringify(facility),
        });
        if (!res.ok) throw new Error('Failed to create facility');
        return res.json();
    },

    updateFacility: async (id: string, facility: any) => {
        const res = await fetchWithAuth(`/facilities/${id}`, {
            method: 'PUT',
            body: JSON.stringify(facility),
        });
        if (!res.ok) throw new Error('Failed to update facility');
        return res.json();
    },

    deleteFacility: async (id: string) => {
        const res = await fetchWithAuth(`/facilities/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete facility');
        return res.json();
    },

    // Courses
    getCourses: async () => {
        const res = await fetch(`${API_BASE_URL}/courses`);
        if (!res.ok) throw new Error('Failed to fetch courses');
        return res.json();
    },

    createCourse: async (course: any) => {
        const res = await fetchWithAuth('/courses', {
            method: 'POST',
            body: JSON.stringify(course),
        });
        if (!res.ok) throw new Error('Failed to create course');
        return res.json();
    },

    updateCourse: async (code: string, course: any) => {
        const res = await fetchWithAuth(`/courses/${code}`, {
            method: 'PUT',
            body: JSON.stringify(course),
        });
        if (!res.ok) throw new Error('Failed to update course');
        return res.json();
    },

    deleteCourse: async (code: string) => {
        const res = await fetchWithAuth(`/courses/${code}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete course');
        return res.json();
    },

    // Messages
    getMessages: async () => {
        const res = await fetchWithAuth('/messages');
        if (!res.ok) throw new Error('Failed to fetch messages');
        return res.json();
    },

    sendMessage: async (message: { name: string; email: string; message: string }) => {
        const res = await fetch(`${API_BASE_URL}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message),
        });
        if (!res.ok) throw new Error('Failed to send message');
        return res.json();
    },

    markMessageRead: async (id: string) => {
        const res = await fetchWithAuth(`/messages/${id}/read`, { method: 'PUT' });
        if (!res.ok) throw new Error('Failed to update message');
        return res.json();
    },

    deleteMessage: async (id: string) => {
        const res = await fetchWithAuth(`/messages/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete message');
        return res.json();
    },

    // Settings / Stats
    getStats: async () => {
        const res = await fetch(`${API_BASE_URL}/settings/stats`);
        if (!res.ok) throw new Error('Failed to fetch stats');
        return res.json();
    },

    updateStats: async (stats: any) => {
        const res = await fetchWithAuth('/settings/stats', {
            method: 'PUT',
            body: JSON.stringify(stats),
        });
        if (!res.ok) throw new Error('Failed to update stats');
        return res.json();
    },

    // File Upload (Local disk)
    uploadFile: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch(`${API_BASE_URL}/upload`, {
            method: 'POST',
            headers: {
                // Must not set Content-Type header manually for FormData, let browser handle boundaries
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: formData
        });
        if (!res.ok) throw new Error('File upload failed');
        return res.json();
    },

    healthCheck: async () => {
        const res = await fetch(`${API_BASE_URL}/health`);
        return res.json();
    },
};

export default api;
