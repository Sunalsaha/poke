import React, { useEffect, useRef, useState } from "react";
import { CameraOff } from "lucide-react";

interface WebcamComponentProps {
  isActive: boolean;
  onToggle: () => void;
}

function WebcamComponent({ isActive, onToggle }: WebcamComponentProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Camera management - turns device camera on/off based on isActive
  useEffect(() => {
    if (isActive && !isStreaming) {
      startCamera();
    } else if (!isActive && isStreaming) {
      stopCamera();
    }
  }, [isActive, isStreaming]);

  // Cleanup on unmount - always stop camera when component unmounts
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setIsLoading(true);
    try {
      // Request camera access - this turns ON the device camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640, min: 480 },
          height: { ideal: 480, min: 360 },
          frameRate: { ideal: 30, max: 30 },
        },
        audio: false,
      });
      
      // Store the stream reference
      streamRef.current = stream;
      
      // Attach stream to video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setIsStreaming(true);
      
      // Set up track event listeners
      const [track] = stream.getVideoTracks();
      if (track) {
        track.addEventListener("ended", () => {
          setIsStreaming(false);
        });
      }
      
    } catch (error) {
      console.error("Error accessing camera:", error);
      setIsStreaming(false);
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    // Stop all tracks - this turns OFF the device camera
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop(); // This releases the camera hardware
      });
      streamRef.current = null;
    }
    
    // Clear video element
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsStreaming(false);
    setIsLoading(false);
  };

  return (
    <div className="w-full">
      {/* Video Container - INCREASED SIZE */}
      <div
        className="relative w-full"
        style={{
          aspectRatio: "4/3",
          maxHeight: "180px",
          height: "180px"
        }}
      >
        {isActive && isStreaming ? (
          // Camera is ON and streaming
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover rounded-lg border border-white/20 bg-black"
          />
        ) : isActive && isLoading ? (
          // Camera is turning ON
          <div className="w-full h-full rounded-lg border border-white/20 bg-black/80 flex items-center justify-center">
            <div className="text-white/60 text-sm text-center">
              <div className="mb-2">Starting Camera...</div>
              <div className="text-xs opacity-75">Please allow camera access</div>
            </div>
          </div>
        ) : (
          // Camera is OFF
          <div className="w-full h-full rounded-lg border border-white/20 bg-black/50 flex items-center justify-center">
            <div className="text-white/60 text-sm text-center">
              <CameraOff className="w-8 h-8 mx-auto mb-2 text-white/40" />
              <div className="mb-1">Camera Off</div>
              <div className="text-xs opacity-75">Click camera icon to turn on</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WebcamComponent;
