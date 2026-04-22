
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../services/api';
import { useUsers } from './UserContext';
import { Message } from '../types';

interface MessageContextType {
    messages: Message[];
    unreadCount: number;
    loading: boolean;
    refreshMessages: () => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    deleteMessage: (id: string) => Promise<void>;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const { currentUser } = useUsers();

    const fetchMessages = async () => {
        if (!currentUser) return;
        setLoading(true);
        try {
            const data = await api.getMessages();
            setMessages(data);
        } catch (err) {
            console.error('Failed to fetch messages', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'super_admin')) {
            fetchMessages();
            // Poll every 30 seconds to keep badge updated
            const interval = setInterval(fetchMessages, 30000);
            return () => clearInterval(interval);
        }
    }, [currentUser]);

    const markAsRead = async (id: string) => {
        try {
            await api.markMessageRead(id);
            setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: true } : m));
        } catch (error) {
            console.error('Error marking as read:', error);
            throw error;
        }
    };

    const deleteMessage = async (id: string) => {
        try {
            await api.deleteMessage(id);
            setMessages(prev => prev.filter(m => m.id !== id));
        } catch (error) {
            console.error('Error deleting message:', error);
            throw error;
        }
    };

    const unreadCount = messages.filter(m => !m.is_read).length;

    return (
        <MessageContext.Provider value={{ messages, unreadCount, loading, refreshMessages: fetchMessages, markAsRead, deleteMessage }}>
            {children}
        </MessageContext.Provider>
    );
};

export const useMessages = () => {
    const context = useContext(MessageContext);
    if (context === undefined) {
        throw new Error('useMessages must be used within a MessageProvider');
    }
    return context;
};
