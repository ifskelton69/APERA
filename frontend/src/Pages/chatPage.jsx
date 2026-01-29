import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import ChatLoader from "../components/ChatLoader";
import { Video, Phone, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";


const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;


const ChatPage = () => {
  const navigate = useNavigate();
  const { id: targetUserId } = useParams();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || !authUser) return;

      try {
        console.log("Initializing stream chat client...");

        const client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token
        );

        const channelId = [authUser._id, targetUserId].sort().join("-");

        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        await currChannel.watch();

        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("Could not connect to chat. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    initChat();

    return () => {
      if (chatClient) {
        chatClient.disconnectUser();
      }
    };
  }, [tokenData, authUser, targetUserId]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `📹 Join my video call: ${callUrl}`,
        attachments: [{
          type: 'video_call',
          url: callUrl
        }]
      });

      toast.success("Video call link sent!");
    }
  };

  const handleVoiceCall = () => {
    if (channel) {
      toast.info("Voice call feature coming soon!");
    }
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="h-[93vh] bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
      <div className="max-w-7xl mx-auto h-full">
        <Chat client={chatClient}>
          <Channel channel={channel}>
            <div className="w-full h-full flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
              {/* Custom Header with Call Buttons */}
              <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-semibold">
                    {channel?.data?.name?.charAt(0) || "C"}
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg">
                      {channel?.data?.name || "Chat"}
                    </h2>
                    <p className="text-xs text-green-100">Online</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleVoiceCall}
                    className="p-2.5 hover:bg-white/20 rounded-full transition-all duration-200 hover:scale-110"
                    title="Voice Call"
                  >
                    <Phone className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleVideoCall}
                    className="p-2.5 hover:bg-white/20 rounded-full transition-all duration-200 hover:scale-110"
                    title="Video Call"
                  >
                    <Video className="w-5 h-5" />
                  </button>
                  <button
                    className="p-2.5 hover:bg-white/20 rounded-full transition-all duration-200"
                    title="Go Home"
                    onClick={() => navigate("/")}
                  >
                    <LogOut />
                  </button>

                </div>
              </div>

              {/* Chat Window */}
              <div className="flex-1 overflow-hidden">
                <Window>
                  <MessageList />
                  <MessageInput focus />
                </Window>
              </div>
            </div>

            {/* Thread */}
            <Thread />
          </Channel>
        </Chat>
      </div>
    </div>
  );
};

export default ChatPage;