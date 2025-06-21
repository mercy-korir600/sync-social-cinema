
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Users, Crown, Settings } from 'lucide-react';
import VideoPlayer from './VideoPlayer';
import ChatPanel from './ChatPanel';
import { useToast } from '@/hooks/use-toast';

const RoomView = ({ room, user, onLeaveRoom }) => {
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState(room.members || [user]);
  const [syncEvents, setSyncEvents] = useState([]);
  const { toast } = useToast();

  // Simulate real-time participants and messages
  useEffect(() => {
    // Add some demo participants
    const demoParticipants = [
      {
        id: 'demo1',
        username: 'MovieLover',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=movielover',
        isAnonymous: false
      },
      {
        id: 'demo2',
        username: 'CinemaFan',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=cinemafan',
        isAnonymous: false
      }
    ];

    // Add demo participants if user is not alone
    if (participants.length === 1) {
      setParticipants(prev => [...prev, ...demoParticipants]);
    }

    // Add some demo messages
    const demoMessages = [
      {
        id: 'msg1',
        text: 'Hey everyone! Ready to watch?',
        user: demoParticipants[0],
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        roomId: room.id
      },
      {
        id: 'msg2',
        text: 'Yes! I love this movie 🍿',
        user: demoParticipants[1],
        timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
        roomId: room.id
      }
    ];

    setMessages(demoMessages);

    // Welcome message
    setTimeout(() => {
      toast({
        title: "Welcome to the room!",
        description: `You've joined "${room.name}". Enjoy watching together!`
      });
    }, 1000);
  }, [room.id, room.name, toast]);

  const handleSendMessage = (message) => {
    setMessages(prev => [...prev, message]);
    
    // Simulate receiving responses from other participants
    setTimeout(() => {
      const responses = [
        "Great choice!",
        "I agree!",
        "This part is amazing",
        "😂😂😂",
        "Wait, let me grab some popcorn",
        "This movie never gets old"
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const randomParticipant = participants.find(p => p.id !== user.id);
      
      if (randomParticipant && Math.random() > 0.3) {
        const responseMessage = {
          id: Math.random().toString(36).substr(2, 9),
          text: randomResponse,
          user: randomParticipant,
          timestamp: new Date().toISOString(),
          roomId: room.id
        };
        setMessages(prev => [...prev, responseMessage]);
      }
    }, 2000 + Math.random() * 3000);
  };

  const handleSyncEvent = (event) => {
    setSyncEvents(prev => [...prev, event]);
    
    // Notify other participants about the sync event
    toast({
      title: `${event.user.username} ${event.type}ed the video`,
      description: `At ${Math.floor(event.currentTime / 60)}:${Math.floor(event.currentTime % 60).toString().padStart(2, '0')}`,
    });
  };

  const isHost = room.host.id === user.id;

  return (
    <div className="min-h-screen bg-dark-gradient">
      <div className="container mx-auto px-4 py-6">
        {/* Room Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Button 
              onClick={onLeaveRoom}
              variant="ghost" 
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Leave Room
            </Button>
            
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                Live
              </Badge>
              {isHost && (
                <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                  <Crown className="w-3 h-3 mr-1" />
                  Host
                </Badge>
              )}
            </div>
          </div>

          <Card className="glass-card mb-6">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-white">{room.name}</CardTitle>
                  {room.description && (
                    <CardDescription className="text-gray-400 mt-1">
                      {room.description}
                    </CardDescription>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Users className="w-5 h-5" />
                    <span className="font-medium">{participants.length}</span>
                  </div>
                  {isHost && (
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                      <Settings className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <VideoPlayer 
              room={room} 
              user={user} 
              onSyncEvent={handleSyncEvent}
            />
          </div>

          {/* Chat Panel */}
          <div className="lg:col-span-1">
            <div className="h-[600px]">
              <ChatPanel
                room={room}
                user={user}
                messages={messages}
                participants={participants}
                onSendMessage={handleSendMessage}
              />
            </div>
          </div>
        </div>

        {/* Sync Events Log (for demo purposes) */}
        {syncEvents.length > 0 && (
          <Card className="glass-card mt-6">
            <CardHeader>
              <CardTitle className="text-white">Recent Sync Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {syncEvents.slice(-5).map((event, index) => (
                  <div key={index} className="text-sm text-gray-400">
                    <span className="text-purple-300">{event.user.username}</span> {event.type}ed at {Math.floor(event.currentTime)}s
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RoomView;
