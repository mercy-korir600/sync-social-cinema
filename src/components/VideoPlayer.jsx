
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Pause, Volume, VolumeX, Monitor } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

const VideoPlayer = ({ room, user, onSyncEvent }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Sample video URL - in a real app, this would come from the room data
  const videoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleLoadStart = () => {
      setIsLoading(true);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadstart', handleLoadStart);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadstart', handleLoadStart);
    };
  }, []);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
      onSyncEvent?.({
        type: 'pause',
        currentTime: video.currentTime,
        timestamp: Date.now(),
        user: user
      });
    } else {
      video.play();
      setIsPlaying(true);
      onSyncEvent?.({
        type: 'play',
        currentTime: video.currentTime,
        timestamp: Date.now(),
        user: user
      });
    }
  };

  const handleSeek = (newTime) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = newTime[0];
    setCurrentTime(newTime[0]);
    onSyncEvent?.({
      type: 'seek',
      currentTime: newTime[0],
      timestamp: Date.now(),
      user: user
    });
  };

  const handleVolumeChange = (newVolume) => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = newVolume[0];
    setVolume(newVolume[0]);
    setIsMuted(newVolume[0] === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.volume = volume;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="glass-card overflow-hidden">
      <div className="relative">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full aspect-video bg-black"
          poster="https://images.unsplash.com/photo-1489599511382-35127e9ae271?w=800&h=450&fit=crop"
        />
        
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="space-y-3">
            {/* Progress Bar */}
            <Slider
              value={[currentTime]}
              max={duration}
              step={1}
              onValueChange={handleSeek}
              className="w-full"
            />

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  onClick={handlePlayPause}
                  size="sm"
                  className="glow-button bg-purple-600 hover:bg-purple-500 text-white"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                
                <div className="flex items-center gap-2">
                  <Button
                    onClick={toggleMute}
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/10"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume className="w-4 h-4" />}
                  </Button>
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    max={1}
                    step={0.1}
                    onValueChange={handleVolumeChange}
                    className="w-20"
                  />
                </div>

                <span className="text-sm text-white">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <Button
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/10"
                onClick={() => videoRef.current?.requestFullscreen()}
              >
                <Monitor className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-2">Big Buck Bunny</h3>
        <p className="text-sm text-gray-400">
          A sample video for demonstration. In a real app, users would be able to load their own videos or stream content.
        </p>
      </div>
    </Card>
  );
};

export default VideoPlayer;
