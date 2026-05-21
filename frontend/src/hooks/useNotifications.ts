import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { io, Socket } from 'socket.io-client';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  createdAt: Date;
}

/**
 * Custom hook for notifications
 */
export function useNotifications(userId?: string) {
  const queryClient = useQueryClient();
  const [socket, setSocket] = useState<Socket | null>(null);

  // Connect to WebSocket
  const connectSocket = useCallback(() => {
    const newSocket = io(import.meta.env.VITE_WS_URL || 'ws://localhost:5000', {
      auth: { token: localStorage.getItem('accessToken') },
    });

    newSocket.on('notification', (notification: Notification) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    });

    setSocket(newSocket);
    return newSocket;
  }, [queryClient]);

  // Disconnect WebSocket
  const disconnectSocket = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  }, [socket]);

  // Fetch notifications
  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      // TODO: Replace with API call
      return {
        notifications: [],
        unreadCount: 0,
      };
    },
    enabled: !!userId,
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      // TODO: API call
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      // TODO: API call
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  return {
    notifications: data?.notifications || [],
    unreadCount: data?.unreadCount || 0,
    isLoading,
    error,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    connectSocket,
    disconnectSocket,
  };
}
