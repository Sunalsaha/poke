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

  // Camera management
  useEffect(() => {
    if (isActive && !isStreaming) {
      startCamera();
    } else if (!isActive && isStreaming) {
      stopCamera();
    }
  }, [isActive, isStreaming]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640, min: 480 },
          height: { ideal: 480, min: 360 },
          frameRate: { ideal: 30, max: 30 },
        },
        audio: false,
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setIsStreaming(true);
      
    } catch (error) {
      console.error("Error accessing camera:", error);
      setIsStreaming(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  };

  return (
    <div className="w-full">
      {/* Video Container - INCREASED SIZE */}
      <div
        className="relative w-full"
        style={{
          aspectRatio: "4/3",
          maxHeight: "180px", // Increased from 120px to 180px
          height: "180px"
        }}
      >
        {isActive && isStreaming ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover rounded-lg border border-white/20 bg-black"
            style={{ transform: "scaleX(-1)" }} // This flips the video horizontally
          />
        ) : isActive && !isStreaming ? (
          <div className="w-full h-full rounded-lg border border-white/20 bg-black/80 flex items-center justify-center">
            <div className="text-white/60 text-sm text-center">
              <div className="mb-2">Connecting...</div>
              <div className="text-xs opacity-75">Starting camera feed</div>
            </div>
          </div>
        ) : (
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
