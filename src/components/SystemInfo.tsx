import React, { useEffect, useState } from 'react';
import { Cpu, HardDrive, Router, Camera, CameraOff, Database, Activity, LucideIcon } from 'lucide-react';
import Weather from './Weather';
import WebcamComponent from './WebcamComponent';

interface SystemInfoProps {
  side: 'left' | 'right';
}

interface CpuData {
  cores: number;
  threads: number;
  base_speed_ghz: number;
  current_speed_ghz: number;
  usage_percent: number;
}

interface RamData {
  used_gb: number;
  total_gb: number;
  available_gb: number;
}

interface DiskData {
  used_gb: number;
  total_gb: number;
}

interface NetworkData {
  local_ip: string;
  public_ip: string;
  bytes_sent_mb: number;
  bytes_recv_mb: number;
  interfaces: string[];
}

interface SpeedData {
  download_mbps: number;
  upload_mbps: number;
}

interface SystemData {
  cpu: CpuData;
  ram: RamData;
  disks: {
    "C:": DiskData;
    "D:": DiskData;
  };
  network: NetworkData;
  network_id: string;
  signal_strength: string;
  speed: SpeedData;
}

type AnimationType = 'spin' | 'pulse' | 'bounce' | 'wave' | 'focus' | 'sweep' | 'float' | 'glow';
type ColorKey = 'green' | 'blue' | 'purple' | 'cyan' | 'emerald' | 'teal' | 'yellow' | 'red';

interface AnimatedIconProps {
  icon: LucideIcon;
  animationType?: AnimationType;
  size?: number;
  className?: string;
  color?: string;
  onClick?: () => void;
}

interface CircularProgressBarProps {
  value: number;
  max: number;
  color?: ColorKey;
  size?: number;
  strokeWidth?: number;
  label?: string;
  animate?: boolean;
  showValue?: boolean;
}

interface EnhancedBoxProps {
  children: React.ReactNode;
  title: string;
  icon: LucideIcon;
  animationType?: AnimationType;
  className?: string;
  isCompact?: boolean;
  onIconClick?: () => void;
}

const SystemInfo: React.FC<SystemInfoProps> = ({ side }) => {
  // System data with proper typing - moved from App component
  const systemData: SystemData = {
    cpu: { 
      cores: 8, 
      threads: 16, 
      base_speed_ghz: 3.2, 
      current_speed_ghz: 3.8, 
      usage_percent: 45 
    },
    ram: { 
      used_gb: 8.5, 
      total_gb: 16, 
      available_gb: 7.5 
    },
    disks: { 
      "C:": { used_gb: 180, total_gb: 250 }, 
      "D:": { used_gb: 320, total_gb: 500 } 
    },
    network: { 
      local_ip: '192.168.1.100', 
      public_ip: '203.0.113.100', 
      bytes_sent_mb: 1250, 
      bytes_recv_mb: 3800, 
      interfaces: ['WiFi', 'Ethernet'] 
    },
    network_id: 'STARK_IND', 
    signal_strength: '98%', 
    speed: { 
      download_mbps: 150.5, 
      upload_mbps: 45.2 
    }
  };

  // Add camera state management
  const [isCameraActive, setIsCameraActive] = useState<boolean>(true);

  const handleCameraToggle = (): void => {
    setIsCameraActive(!isCameraActive);
  };

  // Animated Icon Wrapper Component
  const AnimatedIcon: React.FC<AnimatedIconProps> = ({ 
    icon: Icon, 
    animationType = 'pulse', 
    size, 
    className = '', 
    color,
    onClick
  }) => {
    const getAnimationClass = (): string => {
      switch (animationType) {
        case 'spin':
          return 'animate-spin-slow';
        case 'pulse':
          return 'animate-pulse-glow';
        case 'bounce':
          return 'animate-bounce-subtle';
        case 'wave':
          return 'animate-wave';
        case 'focus':
          return 'animate-focus';
        case 'sweep':
          return 'animate-sweep';
        case 'float':
          return 'animate-float';
        case 'glow':
          return 'animate-glow-cycle';
        default:
          return 'animate-pulse-glow';
      }
    };

    return (
      <div 
        className={`${getAnimationClass()} ${className} ${onClick ? 'cursor-pointer hover:scale-110 transition-transform duration-200' : ''}`}
        onClick={onClick}
      >
        <Icon 
          className={`w-${size || 5} h-${size || 5} text-white drop-shadow-sm transition-all duration-300`} 
          style={{ color }}
        />
      </div>
    );
  };

  // Circular Progress Bar Component
  const CircularProgressBar: React.FC<CircularProgressBarProps> = ({ 
    value, 
    max, 
    color = 'green',
    size = 45,
    strokeWidth = 4,
    label = '',
    animate = true,
    showValue = false
  }) => {
    const [animatedPercentage, setAnimatedPercentage] = useState<number>(0);
    
    const actualPercentage = Math.min(Math.max((value / max) * 100, 0), 100);
    
    const colorMap: Record<ColorKey, { primary: string; secondary: string; glow: string }> = {
      green: { primary: '#10B981', secondary: '#34D399', glow: 'shadow-emerald-500/50' },
      blue: { primary: '#3B82F6', secondary: '#60A5FA', glow: 'shadow-blue-500/50' },
      purple: { primary: '#8B5CF6', secondary: '#A78BFA', glow: 'shadow-purple-500/50' },
      cyan: { primary: '#06B6D4', secondary: '#67E8F9', glow: 'shadow-cyan-500/50' },
      emerald: { primary: '#059669', secondary: '#34D399', glow: 'shadow-emerald-500/50' },
      teal: { primary: '#0D9488', secondary: '#5EEAD4', glow: 'shadow-teal-500/50' },
      yellow: { primary: '#F59E0B', secondary: '#FCD34D', glow: 'shadow-yellow-500/50' },
      red: { primary: '#EF4444', secondary: '#F87171', glow: 'shadow-red-500/50' }
    };
    const colors = colorMap[color];
    
    useEffect(() => {
      if (animate) {
        setAnimatedPercentage(0);
        const timer = setTimeout(() => {
          setAnimatedPercentage(actualPercentage);
        }, 100);
        return () => clearTimeout(timer);
      } else {
        setAnimatedPercentage(actualPercentage);
      }
    }, [actualPercentage, animate]);
    
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference;
    
    return (
      <div className="flex items-center justify-center relative">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="drop-shadow-sm"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#gradient-${color}-${size})`}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`transition-all duration-1000 ease-out drop-shadow-lg ${colors.glow}`}
            style={{
              filter: `drop-shadow(0 0 8px ${colors.primary}40)`,
            }}
          />
          <defs>
            <linearGradient id={`gradient-${color}-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.primary} />
              <stop offset="100%" stopColor={colors.secondary} />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <div className={`text-xs font-bold text-${color}-300`}>
            {showValue 
              ? value.toFixed(0) 
              : `${animatedPercentage.toFixed(0)}%`
            }
          </div>
          {label && (
            <div className={`text-xs text-${color}-400 opacity-80`}>
              {label}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Enhanced Box Component
  const EnhancedBox: React.FC<EnhancedBoxProps> = ({ 
    children, 
    title, 
    icon: Icon,
    animationType = 'pulse',
    className = '',
    isCompact = false,
    onIconClick
  }) => {
    return (
      <div className={`
        relative overflow-hidden rounded-xl 
        ${isCompact ? 'w-72 sm:w-80' : 'w-80'} h-auto
        border border-white/10
        hover:border-white/20
        transition-all duration-500 ease-out
        hover:scale-[1.02] hover:-translate-y-1
        group ${className}
      `}>
        <div 
          className="absolute top-0 left-0 w-1/2 h-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background: 'linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.25) 20%, rgba(255,255,255,0.65) 40%, rgba(255,255,255,0.25) 60%, transparent 100%)',
            filter: 'blur(25px)',
            transform: 'skewX(-25deg)',
            animation: 'moveShine 3s infinite',
            left: '-75%'
          }}
        />
        
        <div className={`relative ${isCompact ? 'p-3' : 'p-4'}`}>
          <div className={`flex items-center space-x-2 ${isCompact ? 'mb-2' : 'mb-3'}`}>
            <div className={`${isCompact ? 'p-1.5' : 'p-2'} rounded-lg bg-white/10 border border-white/20 shadow-md`}>
              <AnimatedIcon 
                icon={Icon} 
                animationType={animationType}
                size={isCompact ? 4 : 5}
                className="text-white drop-shadow-sm" 
                onClick={onIconClick}
              />
            </div>
            <h3 className={`text-white font-bold ${isCompact ? 'text-xs' : 'text-sm'} tracking-wider`}>
              {title}
            </h3>
          </div>
          
          {children}
        </div>
        
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>
    );
  };

  // LEFT PANEL - COMPACT SYSTEM INFORMATION + WEATHER
  const leftPanelData: JSX.Element = (
    <>
      <EnhancedBox title="CPU CORE" icon={Cpu} animationType="spin" isCompact>
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 grid grid-cols-2 gap-1 text-xs text-white/90">
            <span>Cores: <span className="text-white font-semibold">{systemData.cpu.cores}</span></span>
            <span>Threads: <span className="text-white font-semibold">{systemData.cpu.threads}</span></span>
            <span>Base: <span className="text-white font-semibold">{systemData.cpu.base_speed_ghz.toFixed(1)}GHz</span></span>
            <span>Current: <span className="text-white font-semibold">{systemData.cpu.current_speed_ghz.toFixed(1)}GHz</span></span>
          </div>
          <div className="flex-shrink-0">
            <CircularProgressBar 
              value={systemData.cpu.usage_percent} 
              max={100} 
              color="emerald"
              size={45}
              strokeWidth={4}
            />
          </div>
        </div>
      </EnhancedBox>

      <EnhancedBox title="MEMORY" icon={Database} animationType="glow" isCompact>
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 space-y-1 text-xs text-white/90">
            <div>
              <span>Used: <span className="text-white font-semibold">
                {systemData.ram.used_gb.toFixed(1)}GB / {systemData.ram.total_gb.toFixed(0)}GB
              </span></span>
            </div>
            <span className="text-xs text-white/70">
              Available: <span className="text-white">{systemData.ram.available_gb.toFixed(1)}GB</span>
            </span>
          </div>
          <div className="flex-shrink-0">
            <CircularProgressBar 
              value={systemData.ram.used_gb} 
              max={systemData.ram.total_gb} 
              color="blue"
              size={45}
              strokeWidth={4}
            />
          </div>
        </div>
      </EnhancedBox>

      <EnhancedBox title="STORAGE" icon={HardDrive} animationType="bounce" isCompact>
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 space-y-0.5 text-xs text-white/90">
            <div>
              <span>C:\ <span className="text-white font-semibold">
                {systemData.disks["C:"].used_gb.toFixed(0)}GB / {systemData.disks["C:"].total_gb.toFixed(0)}GB
              </span></span>
            </div>
            <span className="text-xs text-white/70">
              Free: <span className="text-white">
                {(systemData.disks["C:"].total_gb - systemData.disks["C:"].used_gb).toFixed(0)}GB
              </span>
            </span>
          </div>
          <div className="flex-shrink-0">
            <CircularProgressBar 
              value={systemData.disks["C:"].used_gb} 
              max={systemData.disks["C:"].total_gb} 
              color="purple"
              size={40}
              strokeWidth={3}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-white/10 pt-2">
          <div className="flex-1 space-y-0.5 text-xs text-white/90">
            <div>
              <span>D:\ <span className="text-white font-semibold">
                {systemData.disks["D:"].used_gb.toFixed(0)}GB / {systemData.disks["D:"].total_gb.toFixed(0)}GB
              </span></span>
            </div>
            <span className="text-xs text-white/70">
              Free: <span className="text-white">
                {(systemData.disks["D:"].total_gb - systemData.disks["D:"].used_gb).toFixed(0)}GB
              </span>
            </span>
          </div>
          <div className="flex-shrink-0">
            <CircularProgressBar 
              value={systemData.disks["D:"].used_gb} 
              max={systemData.disks["D:"].total_gb} 
              color="teal"
              size={40}
              strokeWidth={3}
            />
          </div>
        </div>

        <div className="border-t border-white/10 pt-2 mt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-white/80 font-medium">Total Storage</span>
            <span className="text-white font-semibold text-xs">
              {(systemData.disks["C:"].used_gb + systemData.disks["D:"].used_gb).toFixed(0)}GB / 
              {(systemData.disks["C:"].total_gb + systemData.disks["D:"].total_gb).toFixed(0)}GB
            </span>
          </div>
          
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 grid grid-cols-2 gap-2 text-xs text-white/90">
              <div>
                <span className="text-xs text-white/70">Used:</span>
                <div className="text-white font-semibold text-xs">
                  {(systemData.disks["C:"].used_gb + systemData.disks["D:"].used_gb).toFixed(0)}GB
                </div>
              </div>
              <div>
                <span className="text-xs text-white/70">Free:</span>
                <div className="text-white font-semibold text-xs">
                  {((systemData.disks["C:"].total_gb + systemData.disks["D:"].total_gb) - 
                    (systemData.disks["C:"].used_gb + systemData.disks["D:"].used_gb)).toFixed(0)}GB
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <CircularProgressBar 
                value={systemData.disks["C:"].used_gb + systemData.disks["D:"].used_gb} 
                max={systemData.disks["C:"].total_gb + systemData.disks["D:"].total_gb} 
                color="cyan"
                size={45}
                strokeWidth={4}
              />
            </div>
          </div>
        </div>
      </EnhancedBox>

      {/* Weather Component */}
      <Weather />
    </>
  );

  // RIGHT PANEL - NETWORK INFORMATION + VISUAL FEED UI
  const rightPanelData: JSX.Element = (
    <>
      <EnhancedBox title="NETWORK STATUS" icon={Router} animationType="wave" isCompact>
        <div className="grid grid-cols-1 gap-2 text-xs text-white/90">
          <div className="space-y-1">
            <span className="text-xs text-white/70">Local IP:</span>
            <div className="text-white font-mono text-xs bg-white/10 px-2 py-1 rounded border border-white/20 break-all">
              {systemData.network.local_ip}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-white/70">Public IP:</span>
            <div className="text-white font-mono text-xs bg-white/10 px-2 py-1 rounded border border-white/20 break-all">
              {systemData.network.public_ip}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-xs text-white/70">Network:</span>
              <div className="text-white font-semibold text-xs">{systemData.network_id}</div>
            </div>
            <div>
              <span className="text-xs text-white/70">Signal:</span>
              <div className="text-white font-semibold text-xs">{systemData.signal_strength}</div>
            </div>
          </div>
        </div>
      </EnhancedBox>

      <EnhancedBox title="CONNECTION SPEED" icon={Activity} animationType="pulse" isCompact>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 grid grid-cols-2 gap-1 text-xs text-white/90">
              <span className="text-xs text-white/70">↓ Download:</span>
              <span className="text-white font-semibold text-xs">{systemData.speed.download_mbps.toFixed(0)} Mbps</span>
              <span className="text-xs text-white/70">↑ Upload:</span>
              <span className="text-white font-semibold text-xs">{systemData.speed.upload_mbps.toFixed(0)} Mbps</span>
            </div>
            <div className="flex-shrink-0">
              <CircularProgressBar 
                value={systemData.speed.download_mbps} 
                max={1000}
                color="emerald"
                size={45}
                strokeWidth={4}
              />
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 grid grid-cols-2 gap-1 text-xs text-white/90">
                <span className="text-xs text-white/70">Sent:</span>
                <span className="text-white font-semibold text-xs">{systemData.network.bytes_sent_mb.toFixed(0)}MB</span>
                <span className="text-xs text-white/70">Received:</span>
                <span className="text-white font-semibold text-xs">{systemData.network.bytes_recv_mb.toFixed(0)}MB</span>
              </div>
              <div className="flex-shrink-0">
                <CircularProgressBar 
                  value={systemData.network.bytes_sent_mb + systemData.network.bytes_recv_mb} 
                  max={10000}
                  color="cyan"
                  size={40}
                  strokeWidth={3}
                />
              </div>
            </div>
            
            <div className="text-xs text-white/70 mt-2">
              <span>Interfaces: </span>
              <span className="text-white text-xs break-words">{systemData.network.interfaces.join(', ')}</span>
            </div>
          </div>
        </div>
      </EnhancedBox>

      {/* **VISUAL FEED UI ONLY** */}
      <EnhancedBox 
        title="VISUAL FEED" 
        icon={isCameraActive ? Camera : CameraOff} 
        animationType="focus" 
        isCompact
        onIconClick={handleCameraToggle}
      >
        <WebcamComponent isActive={isCameraActive} />
      </EnhancedBox>
    </>
  );

  return (
    <div className={`
      fixed z-10 
      ${side === 'left' ? 'left-2 sm:left-4' : 'right-2 sm:right-4'} 
      top-16 sm:top-20
    `}>
      <div className="space-y-2 sm:space-y-3">
        {side === 'left' ? leftPanelData : rightPanelData}
      </div>
      
      <style>{`
        /* Animation Keyframes */
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { 
            opacity: 1; 
            filter: drop-shadow(0 0 8px currentColor); 
          }
          50% { 
            opacity: 0.6; 
            filter: drop-shadow(0 0 12px currentColor); 
          }
        }
        
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        
        @keyframes wave {
          0%, 100% { transform: scaleX(1); }
          25% { transform: scaleX(1.1); }
          75% { transform: scaleX(0.9); }
        }
        
        @keyframes focus {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        
        @keyframes sweep {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(5deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(2deg); }
        }
        
        @keyframes glow-cycle {
          0%, 100% { 
            filter: drop-shadow(0 0 6px currentColor); 
            opacity: 1; 
          }
          25% { 
            filter: drop-shadow(0 0 12px currentColor) drop-shadow(0 0 18px currentColor); 
            opacity: 0.8; 
          }
          50% { 
            filter: drop-shadow(0 0 16px currentColor) drop-shadow(0 0 24px currentColor); 
            opacity: 0.9; 
          }
          75% { 
            filter: drop-shadow(0 0 10px currentColor) drop-shadow(0 0 15px currentColor); 
            opacity: 0.85; 
          }
        }
        
        @keyframes moveShine {
          0% { left: -75%; }
          100% { left: 125%; }
        }
        
        /* Animation Classes */
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
        
        .animate-wave {
          animation: wave 2.5s ease-in-out infinite;
        }
        
        .animate-focus {
          animation: focus 3s ease-in-out infinite;
        }
        
        .animate-sweep {
          animation: sweep 4s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-glow-cycle {
          animation: glow-cycle 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default SystemInfo;
