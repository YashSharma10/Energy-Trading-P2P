import { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "@/context/AuthContext";
import { SOCKET_BASE_URL } from "@/constants/api";
import {
  getChatMessages,
  getChatableUsers,
  getOrCreateChat,
  getUserChats
} from "@/services/chatService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";

const getUserId = (user) => user?._id || user?.id || user?.userId || null;

const LiveChatPanel = ({ initialParticipantId = null }) => {
  const { user, token } = useAuth();
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [socketConnected, setSocketConnected] = useState(false);
  const activeChatRef = useRef(null);
  const initialParticipantRef = useRef(null);
  const socketRef = useRef(null);

  const socket = useMemo(() => {
    if (!token) return null;
    
    console.log("🔌 Connecting to socket:", SOCKET_BASE_URL);
    
    const socketInstance = io(SOCKET_BASE_URL, {
      auth: { token },
      transports: ["websocket", "polling"]
    });

    // Add connection event handlers for debugging
    socketInstance.on("connect", () => {
      console.log("✅ Socket connected:", socketInstance.id);
      setSocketConnected(true);
    });

    socketInstance.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error.message);
      setSocketConnected(false);
      toast.error("Chat connection failed");
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("🔌 Socket disconnected:", reason);
      setSocketConnected(false);
    });

    socketInstance.on("error", (error) => {
      console.error("❌ Socket error:", error);
    });

    // Store socket in ref for cleanup
    socketRef.current = socketInstance;

    return socketInstance;
  }, [token]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [chatList, userList] = await Promise.all([
          getUserChats(),
          getChatableUsers()
        ]);
        setChats(chatList.data || []);
        setUsers(userList.data || []);
      } catch (error) {
        toast.error("Failed to load chat data");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  useEffect(() => {
    if (!socket) return undefined;

    const handleMessage = ({ chatId, message }) => {
      console.log("📨 Received message:", { chatId, message });
      
      setChats((previous) =>
        previous.map((chat) =>
          chat._id === chatId
            ? {
                ...chat,
                lastMessage: message.content,
                lastMessageTime: message.timestamp
              }
            : chat
        )
      );

      if (activeChatRef.current?._id === chatId) {
        setMessages((previous) => [...previous, message]);
      }
    };

    const handleChatJoined = ({ chatId }) => {
      console.log("✅ Successfully joined chat:", chatId);
    };

    socket.on("chat:message", handleMessage);
    socket.on("chat:joined", handleChatJoined);

    return () => {
      socket.off("chat:message", handleMessage);
      socket.off("chat:joined", handleChatJoined);
    };
  }, [socket]);

  // Cleanup socket only on component unmount
  useEffect(() => {
    return () => {
      if (socketRef.current && socketRef.current.connected) {
        console.log("🔴 Disconnecting socket on component unmount");
        socketRef.current.disconnect();
      }
    };
  }, []); // Empty dependency array - only run on mount/unmount

  useEffect(() => {
    if (!socket || !activeChat?._id) return;
    
    console.log("🔗 Joining chat:", activeChat._id);
    socket.emit("chat:join", { chatId: activeChat._id });

    return () => {
      console.log("👋 Leaving chat:", activeChat._id);
      socket.emit("chat:leave", { chatId: activeChat._id });
    };
  }, [socket, activeChat]);

  const openChatWithUser = async (participantId) => {
    try {
      const response = await getOrCreateChat(participantId);
      const chat = response.data;
      setActiveChat(chat);
      await loadMessages(chat._id);

      setChats((previous) => {
        const exists = previous.some((item) => item._id === chat._id);
        return exists ? previous : [chat, ...previous];
      });
    } catch (error) {
      toast.error("Failed to start chat");
    }
  };

  useEffect(() => {
    if (!initialParticipantId) return;
    if (initialParticipantRef.current === initialParticipantId) return;

    initialParticipantRef.current = initialParticipantId;
    openChatWithUser(initialParticipantId);
  }, [initialParticipantId]);

  const loadMessages = async (chatId) => {
    try {
      const response = await getChatMessages(chatId);
      setMessages(response.data || []);
    } catch (error) {
      toast.error("Failed to load messages");
    }
  };

  const handleChatSelect = async (chat) => {
    setActiveChat(chat);
    await loadMessages(chat._id);
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();
    const trimmed = messageInput.trim();
    if (!trimmed || !activeChat?._id) return;

    setMessageInput("");

    if (!socket || !socket.connected) {
      console.error("❌ Socket not connected");
      toast.error("Live connection unavailable");
      return;
    }

    console.log("📤 Sending message:", { chatId: activeChat._id, content: trimmed });

    socket.emit("chat:message", { chatId: activeChat._id, content: trimmed }, (response) => {
      if (response) {
        if (response.success) {
          console.log("✅ Message sent successfully");
        } else {
          console.error("❌ Message failed:", response.message);
          toast.error(response.message || "Failed to send message");
        }
      }
    });
  };

  const currentUserId = getUserId(user);

  return (
    <div className="grid gap-4 md:grid-cols-[260px_1fr]">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <MessageCircle className="h-4 w-4" />
            Chat List
            {socketConnected ? (
              <span className="ml-auto flex items-center gap-1 text-xs font-normal text-green-600">
                <span className="h-2 w-2 rounded-full bg-green-600"></span>
                Online
              </span>
            ) : (
              <span className="ml-auto flex items-center gap-1 text-xs font-normal text-red-600">
                <span className="h-2 w-2 rounded-full bg-red-600"></span>
                Offline
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading chats...</p>
          ) : (
            <>
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  Recent Chats
                </p>
                <div className="space-y-2">
                  {chats.length === 0 && (
                    <p className="text-sm text-muted-foreground">No chats yet.</p>
                  )}
                  {chats.map((chat) => {
                    const otherParticipant = chat.participants?.find(
                      (participant) => participant._id !== currentUserId
                    );
                    return (
                      <button
                        key={chat._id}
                        type="button"
                        onClick={() => handleChatSelect(chat)}
                        className={`w-full rounded-md border border-border px-3 py-2 text-left text-sm transition-colors hover:bg-muted ${
                          activeChat?._id === chat._id ? "bg-muted" : ""
                        }`}
                      >
                        <p className="font-medium text-foreground">
                          {otherParticipant?.name || otherParticipant?.email || "Chat"}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {chat.lastMessage || "Start a conversation"}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  Available Users
                </p>
                <div className="space-y-2">
                  {users.length === 0 && (
                    <p className="text-sm text-muted-foreground">No users found.</p>
                  )}
                  {users.map((participant) => (
                    <button
                      key={participant._id}
                      type="button"
                      onClick={() => openChatWithUser(participant._id)}
                      className="w-full rounded-md border border-border px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
                    >
                      <p className="font-medium text-foreground">
                        {participant.name || participant.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {participant.role}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base">
            {activeChat ? "Conversation" : "Select a chat"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!activeChat ? (
            <p className="text-sm text-muted-foreground">
              Pick a user to start messaging.
            </p>
          ) : (
            <>
              <div className="h-80 overflow-y-auto rounded-md border border-border p-3">
                <div className="space-y-3">
                  {messages.length === 0 && (
                    <p className="text-sm text-muted-foreground">No messages yet.</p>
                  )}
                  {messages.map((message) => {
                    const isMe = message.sender?._id === currentUserId || message.sender === currentUserId;
                    return (
                      <div
                        key={`${message._id || message.timestamp}`}
                        className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg px-3 py-2 text-sm ${
                            isMe
                              ? "bg-brandMainColor text-white"
                              : "bg-muted text-foreground"
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <Input
                  value={messageInput}
                  onChange={(event) => setMessageInput(event.target.value)}
                  placeholder={socketConnected ? "Type a message..." : "Connecting..."}
                  disabled={!socketConnected}
                />
                <Button 
                  type="submit" 
                  className="bg-brandMainColor hover:bg-brandMainColor/90"
                  disabled={!socketConnected}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveChatPanel;
