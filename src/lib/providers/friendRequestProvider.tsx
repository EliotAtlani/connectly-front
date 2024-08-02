import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getUser } from "../utils";
import { apiService } from "../apiService";

interface FriendRequestContextType {
  numberFriendRequest: number;
  fetchFriendsRequest: () => Promise<void>;
}

const FriendRequestContext = createContext<
  FriendRequestContextType | undefined
>(undefined);

export const useFriendRequest = (): FriendRequestContextType => {
  const context = useContext(FriendRequestContext);
  if (!context) {
    throw new Error(
      "useFriendRequest must be used within a FriendRequestProvider"
    );
  }
  return context;
};

interface FriendRequestProviderProps {
  children: ReactNode;
}

export const FriendRequestProvider: React.FC<FriendRequestProviderProps> = ({
  children,
}) => {
  const [numberFriendRequest, setNumberFriendRequest] = useState<number>(0);
  const user = getUser(); // Adjust the typing if needed

  const fetchFriendsRequest = async () => {
    try {
      const response = await apiService.get<number>(
        `/users/friends-request-number/${user?.userId}`
      );
      setNumberFriendRequest(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user?.userId) {
      fetchFriendsRequest();
    }
  }, [user?.userId]);

  return (
    <FriendRequestContext.Provider
      value={{ numberFriendRequest, fetchFriendsRequest }}
    >
      {children}
    </FriendRequestContext.Provider>
  );
};
