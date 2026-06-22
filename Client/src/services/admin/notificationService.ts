import axios from "axios";

export const getNotifications = async (page: number = 1, limit: number = 20) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.get(`/api/notifications/admin?page=${page}&limit=${limit}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const markNotificationAsRead = async (id: string) => {
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

export const markAllNotificationsAsRead = async () => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.patch(`/api/notifications/admin/read-all`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteNotification = async (id: string) => {
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
