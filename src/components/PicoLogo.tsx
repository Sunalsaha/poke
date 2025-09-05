import React, { useEffect, useRef, useState } from 'react';
import { Renderer, Program, Mesh, Triangle, Vec3 } from 'ogl';
import picoImage from '../pico.png'; // Import the pico image

interface PicoLogoProps {
  state: 'trying' | 'connected' | 'cannot' | 'idle' | 'listening' | 'thinking' | 'preparing';
  onStateChange: (state: 'trying' | 'connected' | 'cannot' | 'idle' | 'listening' | 'thinking' | 'preparing') => void;
}

const PicoLogo: React.FC<PicoLogoProps> = ({ state, onStateChange }) => {
  const ctnDom = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [audioData, setAudioData] = useState<number[]>([0, 0, 0, 0, 0]);
  
  // New states for picture feature
  const [showPicture, setShowPicture] = useState(false);
  const [pictureSrc, setPictureSrc] = useState<string | null>(null);
  const [pictureOpacity, setPictureOpacity] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>();

  // Download function
  const downloadImage = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `generated-image-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
      window.open(imageUrl, '_blank');
    }
  };

  // Calculate responsive image size
  const getImageStyle = () => {
    if (!imageLoaded || !imageDimensions.width || !imageDimensions.height) {
      return { width: '320px', height: '320px' };
    }
    const maxWidth = 400;
    const maxHeight = 400;
    const aspectRatio = imageDimensions.width / imageDimensions.height;
    
    let width = imageDimensions.width;
    let height = imageDimensions.height;
    
    if (width > maxWidth || height > maxHeight) {
      if (aspectRatio > 1) {
        width = maxWidth;
        height = maxWidth / aspectRatio;
      } else {
        height = maxHeight;
        width = maxHeight * aspectRatio;
      }
    }
    
    const minSize = 200;
    if (width < minSize && height < minSize) {
      if (aspectRatio > 1) {
        width = minSize;
        height = minSize / aspectRatio;
      } else {
        height = minSize;
        width = minSize * aspectRatio;
      }
    }
    return { width: `${width}px`, height: `${height}px` };
  };

  // Microphone access and audio analysis
  useEffect(() => {
    const startMicrophone = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContextRef.current = new AudioContext();
        const source = audioContextRef.current.createMediaStreamSource(stream);
        analyserRef.current = audioContextRef.current.createAnalyser();
        
        analyserRef.current.fftSize = 256;
        analyserRef.current.smoothingTimeConstant = 0.8;
        source.connect(analyserRef.current);
        
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        const updateAudioData = () => {
          if (analyserRef.current && state === 'listening') {
            analyserRef.current.getByteFrequencyData(dataArray);
            
            const bands = [];
            const bandSize = Math.floor(bufferLength / 5);
            
            for (let i = 0; i < 5; i++) {
              let sum = 0;
              for (let j = i * bandSize; j < (i + 1) * bandSize; j++) {
                sum += dataArray[j];
              }
              bands.push((sum / bandSize) / 255);
            }
            
            setAudioData(bands);
          }
          
          animationRef.current = requestAnimationFrame(updateAudioData);
        };
        
        updateAudioData();
      } catch (error) {
        console.error('Error accessing microphone:', error);
        const generateRandomData = () => {
          if (state === 'listening') {
            const randomBands = Array.from({ length: 5 }, () => Math.random() * 0.5 + 0.1);
            setAudioData(randomBands);
          }
          animationRef.current = requestAnimationFrame(generateRandomData);
        };
        generateRandomData();
      }
    };

    // Only start microphone for non-connection states
    if (!['trying', 'connected', 'cannot'].includes(state)) {
      startMicrophone();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [state]);

  // Picture generation simulation - only when idle and connected
  useEffect(() => {
    // Only generate pictures when in idle state (after successful connection)
    if (state !== 'idle') return;

    const generatePicture = () => {
      const demoImage = 'https://picsum.photos/600/800?random=' + Math.floor(Math.random() * 1000);
      
      setPictureSrc(demoImage);
      setShowPicture(true);
      setImageLoaded(false);
      
      setTimeout(() => setPictureOpacity(1), 100);
      setTimeout(() => setPictureOpacity(0), 13000);
      setTimeout(() => {
        setShowPicture(false);
        setPictureSrc(null);
        setImageLoaded(false);
        setImageDimensions({ width: 0, height: 0 });
      }, 15000);
    };

    const intervalId = setInterval(generatePicture, 25000);
    const timeoutId = setTimeout(generatePicture, 5000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [state]);

  // State changes simulation (only for normal operation states)
  useEffect(() => {
    if (['trying', 'connected', 'cannot'].includes(state)) return;

    const interval = setInterval(() => {
      if (!isAnimating) {
        const states: Array<'idle' | 'listening' | 'thinking' | 'preparing'> = ['listening', 'thinking', 'preparing', 'idle'];
        const randomState = states[Math.floor(Math.random() * states.length)];
        onStateChange(randomState);
        
        setTimeout(() => {
          onStateChange('idle');
        }, 4000);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [onStateChange, isAnimating, state]);

  const getStateConfig = () => {
    switch (state) {
      case 'trying':
        return { 
          hue: 200,
          hoverIntensity: 0.6,
          text: 'pico is trying to connect', 
          color: '#3498db',
          glow: 'rgba(52, 152, 219, 0.8)'
        };
      case 'connected':
        return { 
          hue: 120,
          hoverIntensity: 0.3,
          text: 'pico is connected', 
          color: '#2ecc71',
          glow: 'rgba(46, 204, 113, 0.8)'
        };
      case 'cannot':
        return { 
          hue: 0,
          hoverIntensity: 0.7,
          text: 'pico cannot connect', 
          color: '#e74c3c',
          glow: 'rgba(231, 76, 60, 0.8)'
        };
      case 'listening':
        return { 
          hue: 60,
          hoverIntensity: 0.4,
          text: 'Pico is listening...', 
          color: '#9C4DFF',
          glow: 'rgba(156, 77, 255, 0.8)'
        };
      case 'thinking':
        return { 
          hue: 180,
          hoverIntensity: 0.3,
          text: 'Pico is thinking...', 
          color: '#4CBEE9',
          glow: 'rgba(76, 190, 233, 0.8)'
        };
      case 'preparing':
        return { 
          hue: 300,
          hoverIntensity: 0.5,
          text: 'Pico is preparing...', 
          color: '#1e70ffff',
          glow: 'rgba(77, 119, 255, 0.8)'
        };
      default:
        return { 
          hue: 0,
          hoverIntensity: 0.2,
          text: 'Pico is idle...', 
          color: '#9C4DFF',
          glow: 'rgba(156, 77, 255, 0.6)'
        };
    }
  };

  // WebGL shader code
  const vert = /* glsl */ `
    precision highp float;
    attribute vec2 position;
    attribute vec2 uv;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  const frag = /* glsl */ `
    precision highp float;
    uniform float iTime;
    uniform vec3 iResolution;
    uniform float hue;
    uniform float hover;
    uniform float rot;
    uniform float hoverIntensity;
    uniform float stateAnimation;
    varying vec2 vUv;

    vec3 rgb2yiq(vec3 c) {
      c = clamp(c, 0.0, 1.0);
      float y = dot(c, vec3(0.299, 0.587, 0.114));
      float i = dot(c, vec3(0.596, -0.274, -0.322));
      float q = dot(c, vec3(0.211, -0.523, 0.312));
      return vec3(y, i, q);
    }
    
    vec3 yiq2rgb(vec3 c) {
      c.x = clamp(c.x, 0.0, 1.0);
      c.y = clamp(c.y, -0.6, 0.6);
      c.z = clamp(c.z, -0.52, 0.52);
      
      float r = c.x + 0.956 * c.y + 0.621 * c.z;
      float g = c.x - 0.272 * c.y - 0.647 * c.z;
      float b = c.x - 1.106 * c.y + 1.703 * c.z;
      
      return clamp(vec3(r, g, b), 0.0, 0.95);
    }
    
    vec3 adjustHue(vec3 color, float hueDeg) {
      color = clamp(color, 0.0, 0.95);
      float hueRad = hueDeg * 3.14159265 / 180.0;
      vec3 yiq = rgb2yiq(color);
      float cosA = cos(hueRad);
      float sinA = sin(hueRad);
      float i = yiq.y * cosA - yiq.z * sinA;
      float q = yiq.y * sinA + yiq.z * cosA;
      yiq.y = clamp(i, -0.6, 0.6);
      yiq.z = clamp(q, -0.52, 0.52);
      vec3 result = yiq2rgb(yiq);
      return clamp(result, 0.0, 0.95);
    }
    
    vec3 hash33(vec3 p3) {
      p3 = fract(p3 * vec3(0.1031, 0.11369, 0.13787));
      p3 += dot(p3, p3.yxz + 19.19);
      return -1.0 + 2.0 * fract(vec3(
        p3.x + p3.y,
        p3.x + p3.z,
        p3.y + p3.z
      ) * p3.zyx);
    }
    
    float snoise3(vec3 p) {
      const float K1 = 0.333333333;
      const float K2 = 0.166666667;
      vec3 i = floor(p + (p.x + p.y + p.z) * K1);
      vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
      vec3 e = step(vec3(0.0), d0 - d0.yzx);
      vec3 i1 = e * (1.0 - e.zxy);
      vec3 i2 = 1.0 - e.zxy * (1.0 - e);
      vec3 d1 = d0 - (i1 - K2);
      vec3 d2 = d0 - (i2 - K1);
      vec3 d3 = d0 - 0.5;
      vec4 h = max(0.6 - vec4(
        dot(d0, d0),
        dot(d1, d1),
        dot(d2, d2),
        dot(d3, d3)
      ), 0.0);
      vec4 n = h * h * h * h * vec4(
        dot(d0, hash33(i)),
        dot(d1, hash33(i + i1)),
        dot(d2, hash33(i + i2)),
        dot(d3, hash33(i + 1.0))
      );
      return dot(vec4(31.316), n);
    }
    
    vec4 extractAlpha(vec3 colorIn) {
      colorIn = clamp(colorIn, 0.0, 0.9);
      float a = max(max(colorIn.r, colorIn.g), colorIn.b);
      a = clamp(a, 0.0, 0.9);
      return vec4(colorIn.rgb / (a + 1e-5), a);
    }
    
    const vec3 baseColor1 = vec3(0.550, 0.236, 0.896);
    const vec3 baseColor2 = vec3(0.268, 0.685, 0.822);
    const vec3 baseColor3 = vec3(0.056, 0.070, 0.540);
    const float innerRadius = 0.6;
    const float noiseScale = 0.65;
    
    float light1(float intensity, float attenuation, float dist) {
      float result = intensity / (1.0 + dist * attenuation);
      return clamp(result, 0.0, 0.8);
    }
    
    float light2(float intensity, float attenuation, float dist) {
      float result = intensity / (1.0 + dist * dist * attenuation);
      return clamp(result, 0.0, 0.7);
    }
    
    vec4 draw(vec2 uv) {
      vec3 color1 = adjustHue(baseColor1, hue);
      vec3 color2 = adjustHue(baseColor2, hue);
      vec3 color3 = adjustHue(baseColor3, hue);
      
      color1 = clamp(color1, 0.0, 0.9);
      color2 = clamp(color2, 0.0, 0.9);
      color3 = clamp(color3, 0.0, 0.9);
      
      float ang = atan(uv.y, uv.x);
      float len = length(uv);
      float invLen = len > 0.0 ? 1.0 / len : 0.0;
      
      float n0 = snoise3(vec3(uv * noiseScale, iTime * 0.5)) * 0.5 + 0.5;
      float r0 = mix(mix(innerRadius, 1.0, 0.4), mix(innerRadius, 1.0, 0.6), n0);
      float d0 = distance(uv, (r0 * invLen) * uv);
      float v0 = light1(0.9, 10.0, d0);
      v0 *= smoothstep(r0 * 1.05, r0, len);
      
      float cl = cos(ang + iTime * 2.0) * 0.5 + 0.5;
      
      float a = iTime * -1.0;
      vec2 pos = vec2(cos(a), sin(a)) * r0;
      float d = distance(uv, pos);
      float v1 = light2(1.2, 5.0, d);
      v1 *= light1(0.8, 50.0, d0);
      
      float v2 = smoothstep(1.0, mix(innerRadius, 1.0, n0 * 0.5), len);
      float v3 = smoothstep(innerRadius, mix(innerRadius, 1.0, 0.5), len);
      
      vec3 col = mix(color1, color2, cl);
      col = mix(color3, col, v0 * 0.8);
      col = (col + v1 * 0.6) * v2 * v3;
      
      col *= 1.0 + stateAnimation * 0.2;
      col = clamp(col, 0.0, 0.85);
      
      return extractAlpha(col);
    }
    
    vec4 mainImage(vec2 fragCoord) {
      vec2 center = iResolution.xy * 0.5;
      float size = min(iResolution.x, iResolution.y);
      vec2 uv = (fragCoord - center) / size * 2.0;
      
      float angle = rot;
      float s = sin(angle);
      float c = cos(angle);
      uv = vec2(c * uv.x - s * uv.y, s * uv.x + c * uv.y);
      
      uv.x += hover * hoverIntensity * 0.05 * sin(uv.y * 10.0 + iTime);
      uv.y += hover * hoverIntensity * 0.05 * sin(uv.x * 10.0 + iTime);
      
      return draw(uv);
    }
    
    void main() {
      vec2 fragCoord = vUv * iResolution.xy;
      vec4 col = mainImage(fragCoord);
      col = clamp(col, 0.0, 1.0);
      gl_FragColor = col;
    }
  `;

  // WebGL setup effect - UPDATED: Only for operational states (not connection states)
  useEffect(() => {
    if (['trying', 'connected', 'cannot'].includes(state)) return; // Don't render WebGL for connection states

    const container = ctnDom.current;
    if (!container) return;

    const renderer = new Renderer({ alpha: true, premultipliedAlpha: false });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    container.appendChild(gl.canvas);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vert,
      fragment: frag,
      uniforms: {
        iTime: { value: 0 },
        iResolution: {
          value: new Vec3(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height)
        },
        hue: { value: 0 },
        hover: { value: 0 },
        rot: { value: 0 },
        hoverIntensity: { value: 0.2 },
        stateAnimation: { value: 0 }
      }
    });

    const mesh = new Mesh(gl, { geometry, program });

    function resize() {
      if (!container) return;
      const dpr = window.devicePixelRatio || 1;
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width * dpr, height * dpr);
      gl.canvas.style.width = width + 'px';
      gl.canvas.style.height = height + 'px';
      program.uniforms.iResolution.value.set(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height);
    }

    let targetHover = 0;
    let currentRot = 0;
    const rotationSpeed = 0.3;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const width = rect.width;
      const height = rect.height;
      const size = Math.min(width, height);
      const centerX = width / 2;
      const centerY = height / 2;
      const uvX = ((x - centerX) / size) * 2.0;
      const uvY = ((y - centerY) / size) * 2.0;
      
      if (Math.sqrt(uvX * uvX + uvY * uvY) < 0.8) {
        targetHover = 1;
      } else {
        targetHover = 0;
      }
    };

    const handleMouseLeave = () => {
      targetHover = 0;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', resize);
    resize();

    let lastTime = 0;
    let rafId: number;

    const update = (t: number) => {
      rafId = requestAnimationFrame(update);
      const dt = (t - lastTime) * 0.001;
      lastTime = t;
      const config = getStateConfig();
      
      program.uniforms.iTime.value = t * 0.001;
      
      const currentHue = program.uniforms.hue.value;
      const targetHue = config.hue;
      let hueDiff = targetHue - currentHue;
      
      if (hueDiff > 180) hueDiff -= 360;
      if (hueDiff < -180) hueDiff += 360;
      
      program.uniforms.hue.value = currentHue + hueDiff * 0.008;
      if (program.uniforms.hue.value < 0) program.uniforms.hue.value += 360;
      if (program.uniforms.hue.value >= 360) program.uniforms.hue.value -= 360;
      
      program.uniforms.hoverIntensity.value += (config.hoverIntensity - program.uniforms.hoverIntensity.value) * 0.05;
      
      const effectiveHover = (!['idle', 'trying'].includes(state)) ? 1 : targetHover;
      program.uniforms.hover.value += (effectiveHover - program.uniforms.hover.value) * 0.08;
      
      if (effectiveHover > 0.5) {
        currentRot += dt * rotationSpeed;
      }
      program.uniforms.rot.value = currentRot;
      
      const targetAnimation = (!['idle', 'trying'].includes(state)) ? 1.0 : 0.0;
      program.uniforms.stateAnimation.value += (targetAnimation - program.uniforms.stateAnimation.value) * 0.06;
      renderer.render({ scene: mesh });
    };

    rafId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      if (container.contains(gl.canvas)) {
        container.removeChild(gl.canvas);
      }
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [state, isAnimating]);

  const config = getStateConfig();
  const imageStyle = getImageStyle();

  return (
    <div className="flex flex-col items-center justify-start space-y-8 p-4 pt-8 relative">
      {/* Connection States Display - UPDATED: Clean red filter for cannot state */}
      {['trying', 'connected', 'cannot'].includes(state) && (
        <div className="w-96 h-96 flex items-center justify-center">
          <div className="relative">
            <img
              src={picoImage}
              alt={`Pico ${state}`}
              className="w-64 h-64 object-contain"
              style={{
                animation: state === 'trying' ? 'connectingAnimation 2s ease-in-out infinite' : 
                          state === 'connected' ? 'connectedAnimation 3s ease-in-out infinite' :
                          'cannotConnectAnimation 2s ease-in-out infinite',
                // UPDATED: Clean red tint for cannot state, similar to connected state approach
                filter: state === 'cannot' 
                  ? `sepia(1) hue-rotate(320deg) saturate(1.8) brightness(1.1) drop-shadow(0 0 30px ${config.glow})`
                  : `drop-shadow(0 0 30px ${config.glow}) brightness(1.1)`,
              }}
            />

            {/* Success glow for connected state */}
            {state === 'connected' && (
              <div
                className="absolute inset-0 rounded-full"
              />
            )}

            {/* Error indicator for cannot connect state */}
            {state === 'cannot' && (
              <div
                className=""
                style={{
                  borderColor: config.color,
                  animation: 'errorPulse 1.5s ease-in-out infinite',
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* WebGL Logo Container (only for operational states) */}
      {!['trying', 'connected', 'cannot'].includes(state) && (
        <div 
          ref={ctnDom} 
          className="w-96 h-96 relative transition-all duration-[2000ms] ease-out cursor-pointer"
          style={{
            filter: !['idle', 'trying'].includes(state)
              ? `drop-shadow(0 0 40px ${config.glow}) drop-shadow(0 0 80px ${config.glow}) brightness(1.1)`
              : `drop-shadow(0 0 30px ${config.glow}) brightness(1.0)`,
            transform: !['idle', 'trying'].includes(state) ? 'scale(1.02)' : 'scale(1.0)',
          }}
        />
      )}

      {/* Generated Picture Overlay (only when idle) */}
      {showPicture && pictureSrc && state === 'idle' && (
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-in-out"
          style={{
            opacity: pictureOpacity,
            transform: `translate(-50%, -50%) scale(${pictureOpacity}) rotate(${(1 - pictureOpacity) * 10}deg)`,
            zIndex: 20,
          }}
        >
          <div className="relative group">
            <img
              src={pictureSrc}
              alt="Generated Picture"
              className="rounded-2xl shadow-2xl border-4 border-white/20 object-cover"
              style={{
                ...imageStyle,
                filter: `drop-shadow(0 0 30px ${config.glow}) brightness(1.1)`,
                boxShadow: `0 0 50px ${config.glow}, 0 0 100px ${config.glow}30`,
              }}
              onLoad={(e) => {
                const img = e.target as HTMLImageElement;
                setImageDimensions({ 
                  width: img.naturalWidth, 
                  height: img.naturalHeight 
                });
                setImageLoaded(true);
              }}
              onError={() => console.error('Picture failed to load')}
            />
            
            {imageLoaded && (
              <button
                onClick={() => downloadImage(pictureSrc)}
                className="absolute top-4 right-4 p-2 rounded-full transition-all duration-300 hover:scale-125 opacity-0 group-hover:opacity-100"
                style={{
                  filter: `drop-shadow(0 0 10px ${config.glow})`,
                }}
                title="Download Image"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ 
                    color: config.color,
                    filter: `drop-shadow(0 0 5px ${config.glow})`,
                  }}
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7,10 12,15 17,10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </button>
            )}
            
            <div
              className="absolute inset-0 rounded-2xl animate-pulse pointer-events-none"
              style={{
                background: `linear-gradient(45deg, ${config.glow}20, transparent, ${config.glow}20)`,
                border: `2px solid ${config.color}40`,
              }}
            />

            {imageLoaded && (
              <div
                className="absolute bottom-4 left-4 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-sm border border-white/20 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ color: config.color }}
              >
                {imageDimensions.width} × {imageDimensions.height}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Status Text and Controls */}
      <div className="text-center">
        <p 
          className="text-2xl font-bold transition-all duration-[1500ms] ease-in-out tracking-wide"
          style={{ 
            color: config.color,
            textShadow: !['idle', 'trying'].includes(state)
              ? `0 0 15px ${config.glow}, 0 0 30px ${config.glow}` 
              : `0 0 10px ${config.glow}`,
            transform: !['idle', 'trying'].includes(state) ? 'translateY(-2px)' : 'translateY(0px)',
          }}
        >
          {config.text}
        </p>
        
        <div className="flex items-center justify-center space-x-3 mt-4">
          {state === 'listening' ? (
            <div className="flex items-end justify-center space-x-1 h-8">
              {audioData.map((amplitude, i) => (
                <div
                  key={i}
                  className="transition-all duration-100 ease-out rounded-t-full"
                  style={{
                    width: '4px',
                    height: `${Math.max(8, amplitude * 32)}px`,
                    backgroundColor: config.color,
                    boxShadow: `0 0 10px ${config.glow}`,
                    animation: `waveAnimation 0.5s ease-in-out infinite ${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          ) : (
            [...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full transition-all duration-[1200ms] ease-in-out"
                style={{ 
                  backgroundColor: config.color,
                  opacity: !['idle', 'trying'].includes(state) ? '1.0' : '0.6',
                  transform: !['idle', 'trying'].includes(state) ? 'scale(1.3)' : 'scale(1.0)',
                  boxShadow: !['idle', 'trying'].includes(state)
                    ? `0 0 10px ${config.glow}` 
                    : `0 0 5px ${config.glow}`,
                  animation: !['idle', 'trying'].includes(state)
                    ? `orbPulse 2s ease-in-out infinite ${i * 0.3}s`
                    : 'none',
                }}
              />
            ))
          )}
        </div>
      </div>

      <style>{`
        @keyframes orbPulse {
          0%, 100% { 
            opacity: 1.0; 
            transform: scale(1.3); 
          }
          50% { 
            opacity: 0.4; 
            transform: scale(0.8); 
          }
        }
        
        @keyframes waveAnimation {
          0%, 100% { 
            transform: scaleY(1); 
          }
          50% { 
            transform: scaleY(1.5); 
          }
        }

        @keyframes connectingAnimation {
          0%, 100% {
            transform: scale(1) rotate(0deg);
            opacity: 0.8;
          }
          25% {
            transform: scale(1.05) rotate(2deg);
            opacity: 1;
          }
          50% {
            transform: scale(1.1) rotate(0deg);
            opacity: 0.9;
          }
          75% {
            transform: scale(1.05) rotate(-2deg);
            opacity: 1;
          }
        }

        @keyframes connectedAnimation {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.02);
            opacity: 0.95;
          }
        }

        @keyframes cannotConnectAnimation {
          0%, 100% {
            transform: scale(1);
            opacity: 0.9;
          }
          25% {
            transform: scale(0.98) rotate(-1deg);
            opacity: 1;
          }
          75% {
            transform: scale(0.98) rotate(1deg);
            opacity: 1;
          }
        }

        @keyframes pulseRing {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.1;
          }
        }

        @keyframes successGlow {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 0.9;
          }
        }

        @keyframes errorPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.05);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default PicoLogo;
