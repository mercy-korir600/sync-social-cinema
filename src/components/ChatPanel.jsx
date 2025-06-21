
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ChatPanel = ({ room, user, messages, onSendMessage, participants }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Math.random().toString(36).substr(2, 9),
      text: newMessage.trim(),
      user: user,
      timestamp: new Date().toISOString(),
      roomId: room.id
    };

    onSendMessage(message);
    setNewMessage('');
  };

  const formatMessageTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Card className="glass-card flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            Chat
          </CardTitle>
          <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
            {participants.length} online
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col min-h-0">
        {/* Participants List */}
        <div className="mb-4 p-3 rounded-lg bg-white/5 border border-white/10">
          <p className="text-sm text-gray-400 mb-2">Participants:</p>
          <div className="flex flex-wrap gap-2">
            {participants.map((participant) => (
              <div key={participant.id} className="flex items-center gap-2 text-sm">
                <img
                  src={participant.avatar}
                  alt={participant.username}
                  className="w-6 h-6 rounded-full border border-purple-400/30"
                />
                <span className={`text-white ${participant.id === user.id ? 'font-semibold' : ''}`}>
                  {participant.username}
                  {participant.id === user.id && ' (You)'}
                  {participant.id === room.host.id && ' 👑'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-4 min-h-0">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="space-y-1">
                <div className="flex items-center gap-2">
                  <img
                    src={message.user.avatar}
                    alt={message.user.username}
                    className="w-6 h-6 rounded-full border border-purple-400/30"
                  />
                  <span className="text-sm font-medium text-purple-300">
                    {message.user.username}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatMessageTime(message.timestamp)}
                  </span>
                </div>
                <div className="ml-8">
                  <p className="text-white text-sm leading-relaxed">
                    {message.text}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-purple-400"
            maxLength={500}
          />
          <Button
            type="submit"
            size="sm"
            className="glow-button bg-purple-600 hover:bg-purple-500 text-white px-3"
            disabled={!newMessage.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChatPanel;
