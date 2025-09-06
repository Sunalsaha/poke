// import React, { useEffect, useRef, useState } from "react";
// import { CameraOff } from "lucide-react";

// interface WebcamComponentProps {
//   isActive: boolean;
//   onToggle: () => void;
// }

// function WebcamComponent({ isActive, onToggle }: WebcamComponentProps) {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const streamRef = useRef<MediaStream | null>(null);
//   const [isStreaming, setIsStreaming] = useState(false);
// // 
//   // Camera management
//   useEffect(() => {
//     if (isActive && !isStreaming) {
//       startCamera();
//     } else if (!isActive && isStreaming) {
//       stopCamera();
//     }
//   }, [isActive, isStreaming]);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       stopCamera();
//     };
//   }, []);

//   const startCamera = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: {
//           width: { ideal: 640, min: 480 },
//           height: { ideal: 480, min: 360 },
//           frameRate: { ideal: 30, max: 30 },
//         },
//         audio: false,
//       });
      
//       streamRef.current = stream;
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//       }
      
//       setIsStreaming(true);
      
//     } catch (error) {
//       console.error("Error accessing camera:", error);
//       setIsStreaming(false);
//     }
//   };

//   const stopCamera = () => {
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach((track) => track.stop());
//       streamRef.current = null;
//     }
//     if (videoRef.current) {
//       videoRef.current.srcObject = null;
//     }
//     setIsStreaming(false);
//   };

//   return (
//     <div className="w-full">
//       {/* Video Container - INCREASED SIZE */}
//       <div
//         className="relative w-full"
//         style={{
//           aspectRatio: "4/3",
//           maxHeight: "180px", // Increased from 120px to 180px
//           height: "180px"
//         }}
//       >
//         {isActive && isStreaming ? (
//           <video
//             ref={videoRef}
//             autoPlay
//             muted
//             playsInline
//             className="w-full h-full object-cover rounded-lg border border-white/20 bg-black"
//             style={{ transform: "scaleX(-1)" }} // This flips the video horizontally
//           />
//         ) : isActive && !isStreaming ? (
//           <div className="w-full h-full rounded-lg border border-white/20 bg-black/80 flex items-center justify-center">
//             <div className="text-white/60 text-sm text-center">
//               <div className="mb-2">Connecting...</div>
//               <div className="text-xs opacity-75">Starting camera feed</div>
//             </div>
//           </div>
//         ) : (
//           <div className="w-full h-full rounded-lg border border-white/20 bg-black/50 flex items-center justify-center">
//             <div className="text-white/60 text-sm text-center">
//               <CameraOff className="w-8 h-8 mx-auto mb-2 text-white/40" />
//               <div className="mb-1">Camera Off</div>
//               <div className="text-xs opacity-75">Click camera icon to turn on</div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default WebcamComponent;

// first code of your


// import React, { useEffect, useRef, useState } from "react";
// import { CameraOff } from "lucide-react";

// interface WebcamComponentProps {
//   isActive: boolean;
//   onToggle: () => void;
// }

// function WebcamComponent({ isActive, onToggle }: WebcamComponentProps) {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const streamRef = useRef<MediaStream | null>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [isStreaming, setIsStreaming] = useState(false);
//   const [emotion, setEmotion] = useState<string>("");
//   const [probablities,setprobablities]=useState<"">;
//   // Camera management
//   useEffect(() => {
//     if (isActive && !isStreaming) {
//       startCamera();
//     } else if (!isActive && isStreaming) {
//       stopCamera();
//     }
//   }, [isActive, isStreaming]);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       stopCamera();
//     };
//   }, []);

//   // Prediction interval
//   useEffect(() => {
//     let interval: NodeJS.Timeout;

//     if (isActive && isStreaming) {
//       interval = setInterval(() => {
//         captureAndSendFrame();
//       }, 5000); // every 5 seconds
//     }

//     return () => {
//       if (interval) clearInterval(interval);
//     };
//   }, [isActive, isStreaming]);

//   const startCamera = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: {
//           width: { ideal: 640, min: 480 },
//           height: { ideal: 480, min: 360 },
//           frameRate: { ideal: 30, max: 30 },
//         },
//         audio: false,
//       });

//       streamRef.current = stream;
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//       }

//       setIsStreaming(true);
//     } catch (error) {
//       console.error("Error accessing camera:", error);
//       setIsStreaming(false);
//     }
//   };

//   const stopCamera = () => {
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach((track) => track.stop());
//       streamRef.current = null;
//     }
//     if (videoRef.current) {
//       videoRef.current.srcObject = null;
//     }
//     setIsStreaming(false);
//   };

//   // Capture frame and send to backend
//   const captureAndSendFrame = async () => {
//     if (!videoRef.current || !canvasRef.current) return;

//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     // Draw current video frame on canvas
//     canvas.width = videoRef.current.videoWidth;
//     canvas.height = videoRef.current.videoHeight;
//     ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

//     // Convert to Blob
//     canvas.toBlob(async (blob) => {
//       if (!blob) return;
//       const formData = new FormData();
//       formData.append("file", blob, "frame.jpg");

//       try {
//         const res = await fetch("http://192.168.79.112:4000/predict/", {
//           method: "POST",
//           body: formData,
//         });

//         if (!res.ok) throw new Error("Failed to fetch emotion");

//         const data = await res.json();
//         console.log("Emotion:", data);
//         setEmotion(data.emotion || ""); // assuming backend sends { emotion: "happy" }
//         setprobablities(data.probabilities || {});
//       } catch (err) {
//         console.error("Error sending frame:", err);
//       }
//     }, "image/jpeg");
//   };

//   return (
//     <div className="w-full">
//       <div
//         className="relative w-full"
//         style={{
//           aspectRatio: "4/3",
//           maxHeight: "180px",
//           height: "180px",
//         }}
//       >
//         {isActive && isStreaming ? (
//           <video
//             ref={videoRef}
//             autoPlay
//             muted
//             playsInline
//             className="w-full h-full object-cover rounded-lg border border-white/20 bg-black"
//             style={{ transform: "scaleX(-1)" }}
//           />
//         ) : isActive && !isStreaming ? (
//           <div className="w-full h-full rounded-lg border border-white/20 bg-black/80 flex items-center justify-center">
//             <div className="text-white/60 text-sm text-center">
//               <div className="mb-2">Connecting...</div>
//               <div className="text-xs opacity-75">Starting camera feed</div>
//             </div>
//           </div>
//         ) : (
//           <div className="w-full h-full rounded-lg border border-white/20 bg-black/50 flex items-center justify-center">
//             <div className="text-white/60 text-sm text-center">
//               <CameraOff className="w-8 h-8 mx-auto mb-2 text-white/40" />
//               <div className="mb-1">Camera Off</div>
//               <div className="text-xs opacity-75">Click camera icon to turn on</div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Hidden canvas for frame capture */}
//       <canvas ref={canvasRef} className="hidden" />

//       {/* Display predicted emotion */}
//       {emotion && (
//         <div className="mt-2 text-center text-sm text-white/80">
//           Detected Emotion: <span className="font-semibold">{emotion}</span>
//         </div>
//       )}
//            {probablities && (
//         <div className="mt-2 text-center text-sm text-white/80">
//           Probabilities: <span className="font-semibold">{JSON.stringify(probabilities)}</span>
//         </div>
//       )}
//     </div>
//   );
// }

// export default WebcamComponent;

import React, { useEffect, useRef, useState } from "react";
import { CameraOff } from "lucide-react";

interface WebcamComponentProps {
  isActive: boolean;
  onToggle: () => void;
}

type PredictResponse = {
  emotion?: string;
  probabilities?: Record<string, number>;
};

export default function WebcamComponent({
  isActive,
  onToggle,
}: WebcamComponentProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isStreaming, setIsStreaming] = useState(false);
  const [emotion, setEmotion] = useState<string>("");
  // Correctly typed probabilities state (object mapping label -> score) or null
  // const [pro, setPro] = useState("");

  // Camera management
  useEffect(() => {

    if (isActive && !isStreaming) {
      startCamera();
    } else if (!isActive && isStreaming) {
      stopCamera();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, isStreaming]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Prediction interval (runs every 5s while camera is active)
  useEffect(() => {
    let intervalId: number | undefined;

    if (isActive && isStreaming) {
      // Optionally do an immediate capture first
      captureAndSendFrame();

      intervalId = window.setInterval(() => {
        captureAndSendFrame();
      }, 5000); // every 5 seconds
    }

    return () => {
      if (intervalId !== undefined) clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, isStreaming]);

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
      if (videoRef.current) videoRef.current.srcObject = stream;
      setIsStreaming(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      setIsStreaming(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setIsStreaming(false);
    // optionally clear emotion/probabilities:
    // setEmotion("");
    // setProbabilities(null);
  };

  // Capture frame and send to backend
  const captureAndSendFrame = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    // fallback sizes if video metadata not ready
    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // draw the current frame
    ctx.drawImage(video, 0, 0, width, height);

    // convert to blob and send
    canvas.toBlob(
      async (blob) => {
        if (!blob) return;
        const formData = new FormData();
        formData.append("file", blob, "frame.jpg");

        try {
          const res = await fetch("http://192.168.79.112:4000/predict/", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) throw new Error(`Server responded ${res.status}`);

          const data = await res.json();
          // console.log("Emotion response:", data);
          //  setPro(data.probabilities);
          // console.log(data.probabilities)
          setEmotion(data.emotion ?? "");
         
        } catch (err) {
          console.error("Error sending frame:", err);
        }
      },
      "image/jpeg",
    );
  };

  return (
    <div className="w-full">
      <div
        className="relative w-full"
        style={{
          aspectRatio: "4/3",
          maxHeight: "180px",
          height: "180px",
        }}
      >
        {isActive && isStreaming ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover rounded-lg border border-white/20 bg-black"
            style={{ transform: "scaleX(-1)" }}
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

      {/* Hidden canvas for frame capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Display predicted emotion */}
      {emotion && (
        <div className="mt-2 text-center text-sm text-white/80">
          Detected Emotion: <span className="font-semibold">{emotion}</span>

        </div>
      )}

      {/* Display probabilities if available */}
      {/* {pro && (
        <div className="mt-2 text-center text-sm text-white/80">
          Probabilities:
          <h3 className="whitespace-pre-wrap text-xs mt-1">
            {JSON.stringify(pro)}
          </h3>
        </div>
      )} */}
    </div>
  );
}
