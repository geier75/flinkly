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
import { Send, Paperclip, ArrowLeft, FileText, Image as ImageIcon, X } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";

export default function Messages() {
  const { user, loading } = useAuth();
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [messageText, setMessageText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: conversations, refetch: refetchConversations } = trpc.messages.getConversations.useQuery(
    undefined,
    { enabled: !!user }
  );

  const { data: messages, refetch: refetchMessages } = trpc.messages.getMessages.useQuery(
    { conversationId: selectedConversationId!, limit: 100, offset: 0 },
    { enabled: !!selectedConversationId }
  );

  const uploadFileMutation = trpc.messages.uploadFile.useMutation();

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
                  const isFile = msg.type === "file" && msg.fileUrl;
                  const isImage = isFile && msg.fileMimeType?.startsWith("image/");

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
                        {isFile && (
                          <div className="mb-2">
                            {isImage ? (
                              <a href={msg.fileUrl!} target="_blank" rel="noopener noreferrer">
                                <img
                                  src={msg.fileUrl!}
                                  alt={msg.fileName || "Image"}
                                  className="max-w-full rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                                  style={{ maxHeight: "300px" }}
                                />
                              </a>
                            ) : (
                              <a
                                href={msg.fileUrl!}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 p-2 bg-background/10 rounded hover:bg-background/20 transition-colors"
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
                          <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                        )}
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
                {selectedFile && (
                  <div className="mb-2 flex items-center gap-2 p-2 bg-muted rounded-lg">
                    {selectedFile.type.startsWith("image/") ? (
                      <ImageIcon className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span className="text-sm flex-1 truncate">{selectedFile.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={handleRemoveFile}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <div className="flex gap-2">
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
                >
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
                    disabled={(!messageText.trim() && !selectedFile) || sendMessageMutation.isPending || isUploading}
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
