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
  chatId: string;
  type: string;
  data: ConversationData;
  messages: ChatType[];
}

export interface ConversationData {
  name: string;
  image: number;
}
export interface ChatType {
  idMessage: string;
  content: string;
  from_user_id: string;
  from_username: string;
  from_user_image: string;
  createdAt: number;
}
