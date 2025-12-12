// @ts-nocheck
/**
 * Messages Page - Real-time Chat Interface
 */

import { useState, useEffect, useRef } from "react";
import { PremiumPageLayout, PremiumCard } from "@/components/PremiumPageLayout";
import { motion } from "framer-motion";
import { useAuth } from "@/_core/hooks/useAuth";
import { messagesApi } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useConversation } from "@/hooks/useSocket";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Paperclip, ArrowLeft, FileText, Image as ImageIcon, X } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";
import { usePushNotifications } from "@/hooks/usePushNotifications";

export default function Messages() {
  const { user, loading } = useAuth();
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [messageText, setMessageText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: conversationsData, refetch: refetchConversations } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => messagesApi.getConversations(),
    enabled: !!user,
  });
  const conversations = conversationsData?.conversations || [];

  const { data: messagesData, refetch: refetchMessages } = useQuery({
    queryKey: ['messages', selectedConversationId],
    queryFn: () => messagesApi.getMessages(selectedConversationId!),
    enabled: !!selectedConversationId,
  });
  const messages = messagesData?.messages || [];

  const sendMessageMutation = useMutation({
    mutationFn: ({ receiverId, content }: { receiverId: number; content: string }) => 
      messagesApi.send(receiverId, content),
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

  const { permission, showNotification, requestPermission } = usePushNotifications();

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

    // Socket event listeners
    const socket = (window as any).socket;
    if (!socket) return;

    socket.on("message_received", handleNewMessage);
    socket.on("new_message", (data: any) => {
      handleNewMessage();
      
      // Show push notification if permission granted
      if (permission === "granted" && document.hidden) {
        showNotification("Neue Nachricht", {
          body: data.message.content || "Du hast eine neue Nachricht erhalten",
          tag: `conversation-${data.conversationId}`,
        });
      }
    });

    return () => {
      socket.off("message_received", handleNewMessage);
      socket.off("new_message");
    };
  }, [selectedConversationId, refetchMessages, refetchConversations]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Datei zu groß (max. 10MB)");
      return;
    }

    setSelectedFile(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSendMessage = async () => {
    if ((!messageText.trim() && !selectedFile) || !selectedConversationId) return;

    try {
      setIsUploading(true);

      if (selectedFile) {
        // Upload file first
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        
        await new Promise((resolve) => {
          reader.onload = async () => {
            const base64 = reader.result as string;
            const base64Data = base64.split(",")[1];

            const uploadResult = await uploadFileMutation.mutateAsync({
              conversationId: selectedConversationId,
              fileData: base64Data,
              fileName: selectedFile.name,
              fileMimeType: selectedFile.type,
              fileSize: selectedFile.size,
            });

            // Send message with file
            await sendMessageMutation.mutateAsync({
              conversationId: selectedConversationId,
              content: messageText.trim() || selectedFile.name,
              type: "file",
              fileUrl: uploadResult.fileUrl,
              fileName: uploadResult.fileName,
              fileSize: uploadResult.fileSize,
              fileMimeType: uploadResult.fileMimeType,
            });

            resolve(true);
          };
        });

        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        // Send text message
        await sendMessageMutation.mutateAsync({
          conversationId: selectedConversationId,
          content: messageText,
          type: "text",
        });
      }
    } catch (error) {
      // Error handled by onError
    } finally {
      setIsUploading(false);
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
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Anmeldung erforderlich</h2>
          <p className="text-slate-500">Bitte melden Sie sich an, um Nachrichten zu sehen.</p>
        </div>
      </div>
    );
  }

  const selectedConversation = conversations?.find((c) => c.id === selectedConversationId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto p-4 h-screen flex flex-col">
        <div className="flex-1 flex gap-6 overflow-hidden">
          {/* Conversations List */}
          <div className={`w-full md:w-96 flex flex-col bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden ${selectedConversationId ? "hidden md:flex" : ""}`}>
            <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-900 to-slate-800">
              <h2 className="text-2xl font-bold text-white">Nachrichten</h2>
              <p className="text-sm mt-1 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-400" : "bg-red-400"}`}></span>
                <span className="text-slate-400">{isConnected ? "Verbunden" : "Getrennt"}</span>
              </p>
            </div>

            <div className="flex-1 overflow-y-auto">
              {conversations?.length === 0 && (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Send className="h-8 w-8 text-slate-400" />
                  </div>
                  <p className="text-slate-600 font-medium">Keine Konversationen</p>
                  <p className="text-sm text-slate-400 mt-2">Starten Sie eine Bestellung, um mit Verkäufern zu chatten.</p>
                </div>
              )}

              {conversations?.map((conv) => (
                <motion.button
                  key={conv.id}
                  whileHover={{ x: 4 }}
                  onClick={() => setSelectedConversationId(conv.id)}
                  className={`w-full p-4 border-b border-slate-100 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-white transition-all text-left ${
                    selectedConversationId === conv.id ? "bg-gradient-to-r from-emerald-50 to-white border-l-4 border-l-emerald-500" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-primary rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/20">
                      {conv.partner?.name?.[0] || "?"}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-slate-800 truncate">{conv.partner?.name || "Unbekannt"}</h3>
                        {conv.lastMessage && (
                          <span className="text-xs text-slate-400 whitespace-nowrap ml-2">
                            {formatDistanceToNow(new Date(conv.lastMessage.createdAt), {
                              addSuffix: true,
                              locale: de,
                            })}
                          </span>
                        )}
                      </div>

                      {conv.lastMessage && (
                        <p className="text-sm text-slate-500 truncate">{conv.lastMessage.content}</p>
                      )}

                      {conv.unreadCount > 0 && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-500 text-white text-xs font-medium rounded-full">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          {selectedConversationId && selectedConversation ? (
            <div className="flex-1 flex flex-col bg-white rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden">
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-gradient-to-r from-white to-slate-50">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-slate-600 hover:bg-slate-100 rounded-xl"
                  onClick={() => setSelectedConversationId(null)}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>

                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-violet-500/20">
                  {selectedConversation.partner?.name?.[0] || "?"}
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800">{selectedConversation.partner?.name || "Unbekannt"}</h3>
                  {typingUsers.size > 0 && (
                    <p className="text-sm text-emerald-500 flex items-center gap-1">
                      <span className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: "0.1s"}}></span>
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></span>
                      </span>
                      Schreibt...
                    </p>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-slate-50/50 to-white">
                {messages?.map((msg: any) => {
                  const isOwnMessage = msg.senderId === user.id;
                  const isFile = msg.type === "file" && msg.fileUrl;
                  const isImage = isFile && msg.fileMimeType?.startsWith("image/");

                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl p-4 shadow-sm ${
                          isOwnMessage
                            ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
                            : "bg-white border border-slate-100"
                        }`}
                      >
                        {isFile && (
                          <div className="mb-2">
                            {isImage ? (
                              <a href={msg.fileUrl!} target="_blank" rel="noopener noreferrer">
                                <img
                                  src={msg.fileUrl!}
                                  alt={msg.fileName || "Image"}
                                  className="max-w-full rounded-xl cursor-pointer hover:opacity-80 transition-opacity"
                                  style={{ maxHeight: "300px" }}
                                />
                              </a>
                            ) : (
                              <a
                                href={msg.fileUrl!}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center gap-2 p-3 rounded-xl transition-colors ${isOwnMessage ? "bg-white/10 hover:bg-white/20" : "bg-slate-50 hover:bg-slate-100"}`}
                              >
                                <FileText className="h-5 w-5" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{msg.fileName || "Datei"}</p>
                                  {msg.fileSize && (
                                    <p className="text-xs opacity-70">
                                      {(msg.fileSize / 1024).toFixed(1)} KB
                                    </p>
                                  )}
                                </div>
                              </a>
                            )}
                          </div>
                        )}
                        {msg.content && (
                          <p className={`text-sm whitespace-pre-wrap break-words ${isOwnMessage ? "" : "text-slate-700"}`}>{msg.content}</p>
                        )}
                        <p className={`text-xs mt-2 ${isOwnMessage ? "text-white/70" : "text-slate-400"}`}>
                          {formatDistanceToNow(new Date(msg.createdAt), {
                            addSuffix: true,
                            locale: de,
                          })}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-slate-100 bg-white">
                {selectedFile && (
                  <div className="mb-3 flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                    {selectedFile.type.startsWith("image/") ? (
                      <ImageIcon className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <FileText className="h-5 w-5 text-emerald-600" />
                    )}
                    <span className="text-sm flex-1 truncate text-slate-700">{selectedFile.name}</span>
                    <span className="text-xs text-slate-500">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-slate-500 hover:text-red-500 hover:bg-red-50"
                      onClick={handleRemoveFile}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <div className="flex gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileSelect}
                    accept="image/*,.pdf,.docx,.xlsx,.zip"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 rounded-xl"
                  >
                    <Paperclip className="h-5 w-5" />
                  </Button>

                  <Input
                    value={messageText}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Nachricht schreiben..."
                    className="flex-1 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20 rounded-xl"
                    disabled={sendMessageMutation.isPending}
                  />

                  <Button
                    onClick={handleSendMessage}
                    disabled={(!messageText.trim() && !selectedFile) || sendMessageMutation.isPending || isUploading}
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-500/20 px-6"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 hidden md:flex items-center justify-center bg-white rounded-3xl shadow-xl shadow-slate-200/50">
              <div className="text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Send className="h-10 w-10 text-slate-400" />
                </div>
                <p className="text-lg font-medium text-slate-700">Wählen Sie eine Konversation aus</p>
                <p className="text-sm text-slate-400 mt-2">um Nachrichten zu sehen</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
