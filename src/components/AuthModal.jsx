
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const AuthModal = ({ isOpen, onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!isLogin && formData.password !== formData.confirmPassword) {
        toast({
          title: "Error",
          description: "Passwords don't match",
          variant: "destructive"
        });
        return;
      }

      // Simulate authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData = {
        id: Math.random().toString(36).substr(2, 9),
        email: formData.email,
        username: formData.username || formData.email.split('@')[0],
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.email}`
      };

      localStorage.setItem('watchtogether_user', JSON.stringify(userData));
      onLogin(userData);
      onClose();
      
      toast({
        title: "Success!",
        description: isLogin ? "Welcome back!" : "Account created successfully!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Authentication failed. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnonymousLogin = () => {
    const anonymousUser = {
      id: Math.random().toString(36).substr(2, 9),
      username: `Guest_${Math.random().toString(36).substr(2, 5)}`,
      email: null,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=anonymous${Date.now()}`,
      isAnonymous: true
    };

    localStorage.setItem('watchtogether_user', JSON.stringify(anonymousUser));
    onLogin(anonymousUser);
    onClose();
    
    toast({
      title: "Welcome!",
      description: "You're now browsing as a guest"
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gray-900/95 backdrop-blur-xl border-purple-500/20">
        <Card className="border-0 bg-transparent">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold text-gradient">
              {isLogin ? 'Welcome Back' : 'Join WatchTogether'}
            </CardTitle>
            <CardDescription className="text-gray-400">
              {isLogin ? 'Sign in to your account' : 'Create your account to get started'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-white">Username</Label>
                  <Input
                    id="username"
                    placeholder="Your username"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                    required={!isLogin}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                  required
                />
              </div>
              
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                    required={!isLogin}
                  />
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full glow-button bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border-0"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
              </Button>
            </form>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-900 px-2 text-gray-400">Or</span>
              </div>
            </div>
            
            <Button 
              onClick={handleAnonymousLogin}
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/5"
            >
              Continue as Guest
            </Button>
            
            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
