export interface Notification {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  creator_name: string;
  created_at: string;
}

export interface NotificationsApiResponse {
  success: boolean;
  data: Notification[];
  meta: {
    unread_count: number;
  };
}

export interface BroadcastPayload {
  title: string;
  message: string;
  role_ids: number[];
}
