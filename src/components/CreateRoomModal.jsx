
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

const CreateRoomModal = ({ isOpen, onClose, onCreate, user }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    maxParticipants: 10,
    isPrivate: false,
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const roomData = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        host: user,
        participants: 1,
        isActive: false,
        videoTitle: null,
        createdAt: new Date().toISOString(),
        members: [user]
      };

      await new Promise(resolve => setTimeout(resolve, 500));
      onCreate(roomData);
      onClose();
      
      toast({
        title: "Room Created!",
        description: `"${formData.name}" is ready for participants`
      });

      setFormData({
        name: '',
        description: '',
        maxParticipants: 10,
        isPrivate: false,
        password: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create room. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-900/95 backdrop-blur-xl border-purple-500/20">
        <Card className="border-0 bg-transparent">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-gradient">
              Create Watch Room
            </CardTitle>
            <CardDescription className="text-gray-400">
              Set up a new room for synchronized viewing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Room Name</Label>
                <Input
                  id="name"
                  placeholder="Movie Night with Friends"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="What are you watching today?"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="bg-white/5 border-white/10 text-white placeholder-gray-400 resize-none"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxParticipants" className="text-white">Max Participants</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  min="2"
                  max="50"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData({...formData, maxParticipants: parseInt(e.target.value)})}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="space-y-0.5">
                  <Label className="text-white">Private Room</Label>
                  <p className="text-sm text-gray-400">Require password to join</p>
                </div>
                <Switch
                  checked={formData.isPrivate}
                  onCheckedChange={(checked) => setFormData({...formData, isPrivate: checked})}
                />
              </div>

              {formData.isPrivate && (
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">Room Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter room password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                    required={formData.isPrivate}
                  />
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full glow-button bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-0"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Room...' : 'Create Room'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRoomModal;
