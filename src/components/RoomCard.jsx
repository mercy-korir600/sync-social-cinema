
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Play, Clock } from 'lucide-react';

const RoomCard = ({ room, onJoin }) => {
  const { id, name, description, participants, isActive, videoTitle, createdAt, maxParticipants } = room;

  return (
    <Card className="glass-card hover:bg-white/10 transition-all duration-300 group cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
            {name}
          </CardTitle>
          <Badge variant={isActive ? "default" : "secondary"} className={isActive ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-gray-500/20 text-gray-400 border-gray-500/30"}>
            {isActive ? 'Active' : 'Waiting'}
          </Badge>
        </div>
        {description && (
          <CardDescription className="text-gray-400 line-clamp-2">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {videoTitle && (
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Play className="w-4 h-4 text-purple-400" />
            <span className="truncate">{videoTitle}</span>
          </div>
        )}
        
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{participants}/{maxParticipants || 10} participants</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
        
        <Button 
          onClick={() => onJoin(room)}
          className="w-full glow-button bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-0"
        >
          Join Room
        </Button>
      </CardContent>
    </Card>
  );
};

export default RoomCard;
