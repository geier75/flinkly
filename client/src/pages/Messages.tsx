/**
 * Messages Page - Real-time Chat Interface
 */

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useConversation } from "@/hooks/useSocket";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Paperclip, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";

export default function Messages() {
  const { user, loading } = useAuth();
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: conversations, refetch: refetchConversations } = trpc.messages.getConversations.useQuery(
    undefined,
    { enabled: !!user }
  );

  const { data: messages, refetch: refetchMessages } = trpc.messages.getMessages.useQuery(
    { conversationId: selectedConversationId!, limit: 100, offset: 0 },
    { enabled: !!selectedConversationId }
  );

  const sendMessageMutation = trpc.messages.sendMessage.useMutation({
    onSuccess: () => {
      setMessageText("");
      refetchMessages();
      stopTyping();
    },
    onError: (error: any) => {
      toast.error(`Fehler: ${error.message}`);
    },
  });

  const { isConnected, typingUsers, startTyping, stopTyping, notifyMessageSent } = useConversation(
    selectedConversationId
  );

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Listen for new messages via Socket.io
  useEffect(() => {
    if (!selectedConversationId) return;

    const handleNewMessage = () => {
      refetchMessages();
      refetchConversations();
    };

    // TODO: Add socket event listeners here
    // socket.on("message_received", handleNewMessage);

    return () => {
      // socket.off("message_received", handleNewMessage);
    };
  }, [selectedConversationId, refetchMessages, refetchConversations]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversationId) return;

    try {
      await sendMessageMutation.mutateAsync({
        conversationId: selectedConversationId,
        content: messageText,
        type: "text",
      });
    } catch (error) {
      // Error handled by onError
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
    startTyping();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-4">Anmeldung erforderlich</h2>
          <p className="text-muted-foreground">Bitte melden Sie sich an, um Nachrichten zu sehen.</p>
        </Card>
      </div>
    );
  }

  const selectedConversation = conversations?.find((c) => c.id === selectedConversationId);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 h-screen flex flex-col">
        <div className="flex-1 flex gap-4 overflow-hidden">
          {/* Conversations List */}
          <Card className={`w-full md:w-96 flex flex-col ${selectedConversationId ? "hidden md:flex" : ""}`}>
            <div className="p-4 border-b">
              <h2 className="text-2xl font-bold">Nachrichten</h2>
              <p className="text-sm text-muted-foreground">
                {isConnected ? "🟢 Verbunden" : "🔴 Getrennt"}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto">
              {conversations?.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  <p>Keine Konversationen vorhanden.</p>
                  <p className="text-sm mt-2">Starten Sie eine Bestellung, um mit Verkäufern zu chatten.</p>
                </div>
              )}

              {conversations?.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversationId(conv.id)}
                  className={`w-full p-4 border-b hover:bg-accent transition-colors text-left ${
                    selectedConversationId === conv.id ? "bg-accent" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarFallback>{conv.partner?.name?.[0] || "?"}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold truncate">{conv.partner?.name || "Unbekannt"}</h3>
                        {conv.lastMessage && (
                          <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                            {formatDistanceToNow(new Date(conv.lastMessage.createdAt), {
                              addSuffix: true,
                              locale: de,
                            })}
                          </span>
                        )}
                      </div>

                      {conv.lastMessage && (
                        <p className="text-sm text-muted-foreground truncate">{conv.lastMessage.content}</p>
                      )}

                      {conv.unreadCount > 0 && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Chat Area */}
          {selectedConversationId && selectedConversation ? (
            <Card className="flex-1 flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setSelectedConversationId(null)}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>

                <Avatar>
                  <AvatarFallback>{selectedConversation.partner?.name?.[0] || "?"}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <h3 className="font-semibold">{selectedConversation.partner?.name || "Unbekannt"}</h3>
                  {typingUsers.size > 0 && (
                    <p className="text-sm text-muted-foreground">Schreibt...</p>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages?.map((msg) => {
                  const isOwnMessage = msg.senderId === user.id;

                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          isOwnMessage
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {formatDistanceToNow(new Date(msg.createdAt), {
                            addSuffix: true,
                            locale: de,
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" disabled>
                    <Paperclip className="h-5 w-5" />
                  </Button>

                  <Input
                    value={messageText}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Nachricht schreiben..."
                    className="flex-1"
                    disabled={sendMessageMutation.isPending}
                  />

                  <Button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim() || sendMessageMutation.isPending}
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="flex-1 hidden md:flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <p className="text-lg">Wählen Sie eine Konversation aus</p>
                <p className="text-sm mt-2">um Nachrichten zu sehen</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
