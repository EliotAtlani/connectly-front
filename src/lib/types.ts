export interface Tabs {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  title: string;
  href: string;
}
export interface Message {
  content: string;
  from_user: string;
  sender: UserData;
  user_image: string;
  type: "TEXT" | "IMAGE" | "SYSTEM";
  __createdtime__: number;
}

export interface UserData {
  userId: string;
  username: string;
  avatar: number;
  isOnBoarded: boolean;
}

export interface ConversationType {
  id: string;
  name?: string;
  type: string;
  data: ConversationData;
  lastMessageReadId: string;
  backgroundImage: number;
  image?: string;
}

export interface ConversationData {
  name: string;
  avatar: number;
}
export interface ChatType {
  id: string;
  content: string;
  senderId: string;
  sender: UserData;
  createdAt: string;
  type: "TEXT" | "IMAGE" | "LOCAL_IMAGE" | "SYSTEM";
  file?: File;
  replyToId?: string;
  replyTo?: ChatType;
  reactions?: Reaction[];
}

export interface Reaction {
  id: string;
  type: ReactionType;
  userId: string;
  user: UserData;
  messageId: string;
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
  createdAt: string;
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
  avatar: number | string;
  lastMessage: Message;
  lastMessageDate: string;
  unreadMessageCount: number;
  isTyping: string[];
  type: "PRIVATE" | "GROUP";
  pinned: boolean;
};

export enum ReactionType {
  LIKE = "LIKE",
  LOVE = "LOVE",
  HAHA = "LAUGH",
  WOW = "WOW",
  SAD = "SAD",
  ANGRY = "ANGRY",
}
