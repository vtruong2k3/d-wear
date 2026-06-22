import axios from "axios";

export const getClientNotifications = async (page: number = 1, limit: number = 20) => {
    const token = localStorage.getItem("token");
    if (!token) return { notifications: [], total: 0, unreadCount: 0 };
    try {
        const response = await axios.get(`/api/notifications/client?page=${page}&limit=${limit}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const markClientNotificationAsRead = async (id: string) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.patch(`/api/notifications/${id}/read`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const markAllClientNotificationsAsRead = async () => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.patch(`/api/notifications/client/read-all`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteClientNotification = async (id: string) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.delete(`/api/notifications/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
