export interface Tabs {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  title: string;
  href: string;
}
export interface Message {
  content: string;
  from_user: string;
  user_image: string;
  __createdtime__: number;
}

export interface UserData {
  userId: string;
  username: string;
  image: number;
  isOnBoarded: boolean;
}

export interface ConversationType {
  id: string;
  name?: string;
  type: string;
  data: ConversationData;
  messages: ChatType[];
}

export interface ConversationData {
  name: string;
  avatar: number;
}
export interface ChatType {
  content: string;
  senderId: string;
  createdAt: string;
}

export interface SendMessage {
  content: string;
  from_user: string;
  user_image: string;
  chatId: string;
  from_username: string;
}

export interface Friends {
  avatar: number;
  userId: string;
  username: string;
}

export interface FriendRequest {
  id: string;
  createdAt: string;
  senderId: string;
  receiverId: string;
  sender: {
    username: string;
    avatar: number;
  };
  status: StatusFriendRequest;
}

enum StatusFriendRequest {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

export type DisplayConversationHistory = {
  chatId: string;
  name: string;
  avatar: number;
  lastMessage: string;
  lastMessageDate: string;
};
