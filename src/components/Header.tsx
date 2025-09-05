import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Battery, BatteryLow, Zap, Clock, EthernetPort } from 'lucide-react';

import logo from '../../src/pico.png';

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  const { date, time } = { date: '2005-08-31', time: '19:42:10' };
  const [animateElectron, setAnimateElectron] = useState(false);
  const [logoClicked, setLogoClicked] = useState(false);
  const [deviceData, setDeviceData] = useState({
    os: '',
    os_version: '',
    network: {
      signal_strength: '0%',
      connected: false,
      type: 'none'
    },
    battery: {
      percent: 0,
      charging: false
    }
  });

  // Handle logo click for big glow animation and page refresh
  const handleLogoClick = () => {
    setLogoClicked(true);
    setAnimateElectron(true);
    
    // Refresh page after animation completes
    setTimeout(() => {
      window.location.reload();
    }, 2000); // Extended to 2 seconds for smoother animation
  };

  // Function to parse Windows version from userAgent
  const parseWindowsVersion = (userAgent: string, platform: string): { os: string, version: string } => {
    if (platform.toLowerCase().includes('win') || userAgent.toLowerCase().includes('windows')) {
      const ntVersionMatch = userAgent.match(/Windows NT (\d+\.\d+)/i);
      
      if (ntVersionMatch) {
        const ntVersion = ntVersionMatch[1];
        
        switch (ntVersion) {
          case '10.0':
            return { os: 'Windows 11', version: 'NT 10.0' };
          case '6.3':
            return { os: 'Windows 8.1', version: 'NT 6.3' };
          case '6.2':
            return { os: 'Windows 8', version: 'NT 6.2' };
          case '6.1':
            return { os: 'Windows 7', version: 'NT 6.1' };
          case '6.0':
            return { os: 'Windows Vista', version: 'NT 6.0' };
          case '5.2':
            return { os: 'Windows Server 2003/XP x64', version: 'NT 5.2' };
          case '5.1':
            return { os: 'Windows XP', version: 'NT 5.1' };
          case '5.0':
            return { os: 'Windows 2000', version: 'NT 5.0' };
          default:
            return { os: 'Windows', version: `NT ${ntVersion}` };
        }
      } else {
        return { os: 'Windows', version: 'Unknown' };
      }
    }
    
    return { os: platform || 'Unknown', version: 'Unknown' };
  };

  useEffect(() => {
    const fetchDeviceData = async () => {
      try {
        const platform = navigator.platform;
        const userAgent = navigator.userAgent;
        
        const { os, version } = parseWindowsVersion(userAgent, platform);
        
        const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
        
        const battery = await (navigator as any).getBattery?.();

        let connectionType = 'wifi';
        if (connection) {
          if (connection.type === 'ethernet' || connection.effectiveType === 'ethernet') {
            connectionType = 'ethernet';
          } else if (connection.type === 'wifi' || connection.effectiveType === '4g' || connection.effectiveType === '3g' || connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
            connectionType = 'wifi';
          }
        }

        setDeviceData({
          os: os,
          os_version: version,
          network: {
            signal_strength: navigator.onLine ? '100%' : '0%',
            connected: navigator.onLine,
            type: connectionType
          },
          battery: {
            percent: battery ? Math.round(battery.level * 100) : 0,
            charging: battery ? battery.charging : false
          }
        });
      } catch (error) {
        console.error('Error fetching device data:', error);
      }
    };

    fetchDeviceData();

    const interval = setInterval(fetchDeviceData, 30000);

    const handleNetworkChange = () => {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      
      let connectionType = 'wifi';
      if (connection) {
        if (connection.type === 'ethernet' || connection.effectiveType === 'ethernet') {
          connectionType = 'ethernet';
        } else {
          connectionType = 'wifi';
        }
      }

      setDeviceData(prev => ({
        ...prev,
        network: {
          signal_strength: navigator.onLine ? '100%' : '0%',
          connected: navigator.onLine,
          type: connectionType
        }
      }));
    };

    window.addEventListener('online', handleNetworkChange);
    window.addEventListener('offline', handleNetworkChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleNetworkChange);
      window.removeEventListener('offline', handleNetworkChange);
    };
  }, []);

  const getBatteryIcon = () => {
    const batteryPercent = deviceData.battery.percent;
    const isCharging = deviceData.battery.charging;

    if (isCharging) {
      return <Zap className="w-4 h-4 animate-pulse text-white drop-shadow-[0_2px_4px_rgba(59,130,246,0.5)]" />;
    } else if (batteryPercent <= 15) {
      return <BatteryLow className="w-4 h-4 text-white drop-shadow-[0_2px_4px_rgba(59,130,246,0.5)]" />;
    } else {
      return <Battery className="w-4 h-4 text-white drop-shadow-[0_2px_4px_rgba(59,130,246,0.5)]" />;
    }
  };

  const getNetworkIcon = () => {
    if (!deviceData.network.connected) {
      return <WifiOff className="w-4 h-4 text-white drop-shadow-[0_2px_4px_rgba(59,130,246,0.5)]" />;
    }
    
    if (deviceData.network.type === 'ethernet') {
      return <EthernetPort className="w-4 h-4 animate-pulse text-white drop-shadow-[0_2px_4px_rgba(59,130,246,0.5)]" />;
    } else {
      return <Wifi className="w-4 h-4 animate-pulse text-white drop-shadow-[0_2px_4px_rgba(59,130,246,0.5)]" />;
    }
  };

  return (
    <>
      <style>{`
        @keyframes glow {
          0%, 100% {
            filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.6)) drop-shadow(0 0 16px rgba(59, 130, 246, 0.4));
          }
          50% {
            filter: drop-shadow(0 0 16px rgba(59, 130, 246, 0.9)) drop-shadow(0 0 24px rgba(59, 130, 246, 0.7)) drop-shadow(0 0 32px rgba(59, 130, 246, 0.5));
          }
        }

        @keyframes bigGlow {
          0% {
            transform: scale(1);
            filter: drop-shadow(0 0 8px rgba(0, 0, 0, 0.6)) drop-shadow(0 0 16px rgba(59, 130, 246, 0.4));
          }
          25% {
            transform: scale(1.5);
            filter: drop-shadow(0 0 15px rgba(59, 130, 246, 0.8)) drop-shadow(0 0 30px rgba(59, 130, 246, 0.6)) drop-shadow(0 0 45px rgba(59, 130, 246, 0.4));
          }
          50% {
            transform: scale(2.2);
            filter: drop-shadow(0 0 25px rgba(59, 130, 246, 1)) drop-shadow(0 0 50px rgba(59, 130, 246, 0.8)) drop-shadow(0 0 75px rgba(59, 130, 246, 0.6)) drop-shadow(0 0 100px rgba(59, 130, 246, 0.4));
          }
          75% {
            transform: scale(2.8);
            filter: drop-shadow(0 0 35px rgba(59, 130, 246, 1)) drop-shadow(0 0 55px rgba(59, 130, 246, 0.9)) drop-shadow(0 0 75px rgba(59, 130, 246, 0.7)) drop-shadow(0 0 110px rgba(59, 130, 246, 0.5));
          }
          100% {
            transform: scale(3.2);
            filter: drop-shadow(0 0 40px rgba(59, 130, 246, 1)) drop-shadow(0 0 60px rgba(59, 130, 246, 0.9)) drop-shadow(0 0 80px rgba(59, 130, 246, 0.7)) drop-shadow(0 0 120px rgba(59, 130, 246, 0.5));
          }
        }
        
        @keyframes orbit {
          0% {
            transform: rotate(0deg) translateX(30px) rotate(0deg);
            opacity: 0.6;
          }
          25% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
          75% {
            opacity: 1;
          }
          100% {
            transform: rotate(360deg) translateX(30px) rotate(-360deg);
            opacity: 0.6;
          }
        }

        @keyframes orbit-reverse {
          0% {
            transform: rotate(0deg) translateX(25px) rotate(0deg);
            opacity: 0.7;
          }
          25% {
            opacity: 0.9;
          }
          50% {
            opacity: 1;
          }
          75% {
            opacity: 0.8;
          }
          100% {
            transform: rotate(-360deg) translateX(25px) rotate(360deg);
            opacity: 0.7;
          }
        }

        @keyframes orbit-big {
          0% {
            transform: rotate(0deg) translateX(60px) rotate(0deg);
            opacity: 0.8;
          }
          25% {
            opacity: 1;
          }
          50% {
            opacity: 0.9;
          }
          75% {
            opacity: 1;
          }
          100% {
            transform: rotate(360deg) translateX(60px) rotate(-360deg);
            opacity: 0.8;
          }
        }

        @keyframes orbit-reverse-big {
          0% {
            transform: rotate(0deg) translateX(50px) rotate(0deg);
            opacity: 0.7;
          }
          25% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
          75% {
            opacity: 1;
          }
          100% {
            transform: rotate(-360deg) translateX(50px) rotate(360deg);
            opacity: 0.7;
          }
        }

        @keyframes spark {
          0%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          25% {
            opacity: 0.8;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
          75% {
            opacity: 0.9;
            transform: scale(1.1);
          }
        }

        @keyframes spark-big {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          25% {
            opacity: 0.9;
            transform: scale(1.5);
          }
          50% {
            opacity: 1;
            transform: scale(2);
          }
          75% {
            opacity: 0.95;
            transform: scale(1.8);
          }
        }

        .animate-glow {
          animation: glow 3s ease-in-out infinite;
          will-change: filter;
        }

        .animate-big-glow {
          animation: bigGlow 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          z-index: 1000;
          will-change: transform, filter;
        }

        .electron {
          position: absolute;
          width: 5px;
          height: 5px;
          background: #3b82f6;
          border-radius: 50%;
          box-shadow: 0 0 8px #000000ff, 0 0 16px #3b82f6, 0 0 24px #3b82f6;
          will-change: transform, opacity;
        }

        .electron-big {
          position: absolute;
          width: 8px;
          height: 8px;
          background: #3b82f6;
          border-radius: 50%;
          box-shadow: 0 0 12px #3b82f6, 0 0 24px #3b82f6, 0 0 36px #3b82f6, 0 0 48px #3b82f6;
          will-change: transform, opacity;
        }

        .electron-1 {
          animation: orbit 2.5s ease-in-out infinite, spark 1.5s ease-in-out infinite;
        }

        .electron-2 {
          animation: orbit-reverse 3s ease-in-out infinite, spark 2s ease-in-out infinite;
          animation-delay: 0.4s;
        }

        .electron-3 {
          animation: orbit 2s ease-in-out infinite, spark 1.2s ease-in-out infinite;
          animation-delay: 0.8s;
        }

        .electron-1-big {
          animation: orbit-big 1.8s ease-in-out infinite, spark-big 1s ease-in-out infinite;
        }

        .electron-2-big {
          animation: orbit-reverse-big 2.2s ease-in-out infinite, spark-big 1.3s ease-in-out infinite;
          animation-delay: 0.3s;
        }

        .electron-3-big {
          animation: orbit-big 1.5s ease-in-out infinite, spark-big 0.8s ease-in-out infinite;
          animation-delay: 0.6s;
        }

        .logo-container {
          position: relative;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          will-change: transform, filter;
        }

        .logo-container:hover {
          transform: scale(1.08);
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .logo-container:active {
          transform: scale(0.98);
          transition: all 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .logo-container-clicked {
          position: relative;
          cursor: pointer;
          z-index: 1000;
          will-change: transform, filter;
        }

        .status-item {
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          border-radius: 8px;
          padding: 6px 8px;
          will-change: transform;
        }

        .status-item:hover {
          transform: scale(1.15);
          transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .smooth-text {
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>

      <header className="flex items-center justify-between p-2 bg-black backdrop-blur-sm border-b border-gray-800 shadow-lg select-none drop-shadow-[0_4px_8px_rgba(59,130,246,0.3)]">
        {/* Left Side - Logo and Info */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4 ml-8">
            {/* Pico Logo */}
            <div 
              className={`${logoClicked ? 'logo-container-clicked' : 'logo-container'} w-12 h-12 flex items-center justify-center`}
              onClick={handleLogoClick}
              title="Click to refresh page with epic animation"
            >
              <img 
                src={logo} 
                alt="Pico Logo" 
                className={`w-12 h-12 object-contain relative z-10 ${logoClicked ? 'animate-big-glow' : 'animate-glow'}`}
              />
              
              {/* Ultra Smooth Electron Animation */}
              {animateElectron && !logoClicked && (
                <>
                  <div className="electron electron-1"></div>
                  <div className="electron electron-2"></div>
                  <div className="electron electron-3"></div>
                </>
              )}

              {/* Ultra Smooth Big Electron Animation */}
              {animateElectron && logoClicked && (
                <>
                  <div className="electron-big electron-1-big"></div>
                  <div className="electron-big electron-2-big"></div>
                  <div className="electron-big electron-3-big"></div>
                </>
              )}
            </div>
            
            {/* Pico Text */}
            <div className="text-xs text-white font-mono drop-shadow-[0_2px_4px_rgba(59,130,246,0.5)] smooth-text">
              OS: {deviceData.os} | Version: {deviceData.os_version}
            </div>
          </div>
        </div>

        {/* Right Side - Status Indicators */}
        <div className="flex items-center space-x-2">
          {/* Network Status */}
          <div className="flex items-center space-x-1 text-white status-item smooth-text">
            {getNetworkIcon()}
            <span className="text-xs drop-shadow-[0_2px_4px_rgba(59,130,246,0.5)]">{deviceData.network.signal_strength}</span>
          </div>

          {/* Battery Status */}
          <div className="flex items-center space-x-1 status-item smooth-text">
            {getBatteryIcon()}
            <span className="text-xs text-white drop-shadow-[0_2px_4px_rgba(59,130,246,0.5)]">{deviceData.battery.percent}%</span>
          </div>

          {/* Date & Time */}
          <div className="flex items-center space-x-1 text-white status-item smooth-text">
            <Clock className="w-4 h-4 drop-shadow-[0_2px_4px_rgba(59,130,246,0.5)]" />
            <div className="text-xs font-mono drop-shadow-[0_2px_4px_rgba(59,130,246,0.5)]">
              {time} | {date}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
