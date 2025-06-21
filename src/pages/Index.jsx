
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Video, Users, Play, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import Header from '../components/Header';
import AuthModal from '../components/AuthModal';
import CreateRoomModal from '../components/CreateRoomModal';
import RoomCard from '../components/RoomCard';
import RoomView from '../components/RoomView';

const Index = () => {
  const [user, setUser] = useState(null);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
  const { toast } = useToast();

  // Check for existing user session
  useEffect(() => {
    const savedUser = localStorage.getItem('watchtogether_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Initialize with some demo rooms
    const demoRooms = [
      {
        id: 'demo1',
        name: 'Friday Movie Night',
        description: 'Join us for the latest blockbuster!',
        participants: 8,
        maxParticipants: 15,
        isActive: true,
        videoTitle: 'The Matrix',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        host: { id: 'host1', username: 'MovieHost', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=host1' },
        members: []
      },
      {
        id: 'demo2',
        name: 'Anime Marathon',
        description: 'Watching Studio Ghibli classics together',
        participants: 4,
        maxParticipants: 10,
        isActive: true,
        videoTitle: 'Spirited Away',
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        host: { id: 'host2', username: 'AnimeGuru', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=host2' },
        members: []
      },
      {
        id: 'demo3',
        name: 'Comedy Central',
        description: 'Laughs and good vibes only',
        participants: 12,
        maxParticipants: 20,
        isActive: false,
        videoTitle: null,
        createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        host: { id: 'host3', username: 'ComedyKing', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=host3' },
        members: []
      }
    ];
    
    setRooms(demoRooms);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('watchtogether_user');
    setUser(null);
    setCurrentRoom(null);
    toast({
      title: "Logged out",
      description: "See you next time!"
    });
  };

  const handleCreateRoom = (roomData) => {
    setRooms(prev => [roomData, ...prev]);
    // Automatically join the created room
    setCurrentRoom(roomData);
  };

  const handleJoinRoom = (room) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    setCurrentRoom({
      ...room,
      members: [...(room.members || []), user]
    });
    
    toast({
      title: "Joined room!",
      description: `Welcome to "${room.name}"`
    });
  };

  const handleLeaveRoom = () => {
    setCurrentRoom(null);
    toast({
      title: "Left room",
      description: "You can join another room anytime"
    });
  };

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // If user is in a room, show the room view
  if (currentRoom) {
    return (
      <>
        <Header user={user} onLogout={handleLogout} currentRoom={currentRoom} />
        <RoomView
          room={currentRoom}
          user={user}
          onLeaveRoom={handleLeaveRoom}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-dark-gradient">
      <Header user={user} onLogout={handleLogout} />

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient animate-fade-in">
              Watch Together
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 animate-fade-in">
              Synchronized video streaming with real-time chat. Create rooms, invite friends, and enjoy movies together, anywhere.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
              {user ? (
                <Button 
                  onClick={() => setShowCreateRoomModal(true)}
                  className="glow-button bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-0 text-lg px-8 py-3"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Room
                </Button>
              ) : (
                <Button 
                  onClick={() => setShowAuthModal(true)}
                  className="glow-button bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-0 text-lg px-8 py-3"
                >
                  Get Started
                </Button>
              )}
              
              <Button 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/5 text-lg px-8 py-3"
              >
                <Video className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 border-t border-white/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Perfect for Social Watching
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="glass-card text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Real-time Sync</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400">
                  Perfect synchronization across all devices. Everyone watches at exactly the same time.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="glass-card text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Live Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400">
                  React and discuss in real-time with integrated chat features during your watch party.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="glass-card text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Play className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Easy Rooms</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400">
                  Create or join rooms instantly. No complex setup required, just pure entertainment.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Active Rooms Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <h2 className="text-3xl font-bold text-white mb-4 sm:mb-0">
              Active Rooms
            </h2>
            
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search rooms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-400 w-64"
                />
              </div>
              
              {user && (
                <Button 
                  onClick={() => setShowCreateRoomModal(true)}
                  className="glow-button bg-purple-600 hover:bg-purple-500 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Room
                </Button>
              )}
            </div>
          </div>

          {filteredRooms.length === 0 ? (
            <Card className="glass-card text-center py-12">
              <CardContent>
                <div className="text-gray-400 mb-4">
                  <Video className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No rooms found</h3>
                  <p>Be the first to create a room and start watching together!</p>
                </div>
                {user && (
                  <Button 
                    onClick={() => setShowCreateRoomModal(true)}
                    className="glow-button bg-purple-600 hover:bg-purple-500 text-white mt-4"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Room
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  onJoin={handleJoinRoom}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modals */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
      />
      
      {user && (
        <CreateRoomModal
          isOpen={showCreateRoomModal}
          onClose={() => setShowCreateRoomModal(false)}
          onCreate={handleCreateRoom}
          user={user}
        />
      )}
    </div>
  );
};

export default Index;
