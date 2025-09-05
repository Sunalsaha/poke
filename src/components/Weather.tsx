import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, MapPin, Thermometer, Calendar, CloudSnow } from 'lucide-react';

const Weather: React.FC = () => {
  const [weather, setWeather] = useState({
    location: 'San Francisco, CA',
    temperature: 27,
    feelsLike: 30,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 12,
    tomorrow: {
      temperature: 24,
      condition: 'Sunny',
      high: 28,
      low: 18
    }
  });

  // Animated Icon Wrapper Component
  const AnimatedIcon: React.FC<{
    icon: React.ComponentType<any>;
    animationType?: 'spin' | 'pulse' | 'bounce' | 'wave' | 'focus' | 'sweep' | 'float' | 'glow' | 'sway' | 'breathe';
    size?: string;
    className?: string;
    color?: string;
  }> = ({ 
    icon: Icon, 
    animationType = 'pulse', 
    size = 'w-4 h-4',
    className = '', 
    color 
  }) => {
    const getAnimationClass = () => {
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
        case 'sway':
          return 'animate-sway';
        case 'breathe':
          return 'animate-breathe';
        default:
          return 'animate-pulse-glow';
      }
    };

    return (
      <div className={`${getAnimationClass()} ${className}`}>
        <Icon 
          className={`${size} drop-shadow-lg transition-all duration-300`} 
          style={{ color }}
        />
      </div>
    );
  };

  useEffect(() => {
    // Simulate weather updates every 30 seconds
    const interval = setInterval(() => {
      setWeather(prev => ({
        ...prev,
        temperature: Math.round(prev.temperature + (Math.random() - 0.5) * 2),
        feelsLike: Math.round(prev.feelsLike + (Math.random() - 0.5) * 2),
        humidity: Math.max(30, Math.min(90, prev.humidity + (Math.random() - 0.5) * 10)),
        windSpeed: Math.max(0, Math.min(25, prev.windSpeed + (Math.random() - 0.5) * 4)),
        tomorrow: {
          ...prev.tomorrow,
          temperature: Math.round(prev.tomorrow.temperature + (Math.random() - 0.5) * 2),
          high: Math.round(prev.tomorrow.high + (Math.random() - 0.5) * 2),
          low: Math.round(prev.tomorrow.low + (Math.random() - 0.5) * 2)
        }
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = (condition: string, size = "w-4 h-4") => {
    switch (condition) {
      case 'Sunny': 
        return (
          <AnimatedIcon 
            icon={Sun} 
            animationType="spin" 
            size={size}
            className="text-yellow-400"
          />
        );
      case 'Rainy': 
        return (
          <AnimatedIcon 
            icon={CloudRain} 
            animationType="bounce" 
            size={size}
            className="text-blue-400"
          />
        );
      case 'Snow':
        return (
          <AnimatedIcon 
            icon={CloudSnow} 
            animationType="float" 
            size={size}
            className="text-cyan-300"
          />
        );
      case 'Partly Cloudy':
      default: 
        return (
          <AnimatedIcon 
            icon={Cloud} 
            animationType="sway" 
            size={size}
            className="text-cyan-300"
          />
        );
    }
  };

  const getTomorrowCondition = () => {
    const conditions = ['Sunny', 'Partly Cloudy', 'Rainy', 'Snow'];
    return conditions[Math.floor(Math.random() * conditions.length)];
  };

  // Enhanced Box Component matching SystemInfo style - REMOVED BACKGROUND
  const EnhancedWeatherBox = ({ 
    children, 
    title, 
    icon: Icon,
    className = ''
  }: { 
    children: React.ReactNode; 
    title: string; 
    icon: any;
    className?: string;
  }) => {
    return (
      <div className={`
        relative overflow-hidden rounded-xl w-72 sm:w-80 h-auto
        border border-white/10
        hover:border-white/20
        transition-all duration-500 ease-out
        hover:scale-[1.02] hover:-translate-y-1
        group ${className}
      `}>
        {/* Glossy Shine Effect */}
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
        
        <div className="relative p-3">
          <div className="flex items-center space-x-2 mb-2">
            <div className="p-1.5 rounded-lg bg-white/10 border border-white/20 shadow-md">
              <AnimatedIcon 
                icon={Icon} 
                animationType="glow"
                size="w-4 h-4"
                className="text-white drop-shadow-sm" 
              />
            </div>
            <h3 className="text-white font-bold text-xs tracking-wider">
              {title}
            </h3>
          </div>
          
          {children}
        </div>
        
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        <style>{`
          @keyframes moveShine {
            0% { left: -75%; }
            100% { left: 125%; }
          }
        `}</style>
      </div>
    );
  };

  return (
    <EnhancedWeatherBox title="WEATHER CONDITIONS" icon={Cloud}>
      <div className="space-y-2">
        {/* Location */}
        <div className="flex items-center space-x-2 text-xs text-white/90">
          <AnimatedIcon 
            icon={MapPin} 
            animationType="pulse" 
            size="w-3 h-3"
            className="text-cyan-400"
          />
          <span className="text-white font-semibold">{weather.location}</span>
        </div>

        {/* Current Weather - Main Display */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getWeatherIcon(weather.condition, "w-8 h-8")}
            <div>
              <div className="text-2xl font-bold text-white">
                {weather.temperature}°C
              </div>
              <div className="text-xs text-white/70">{weather.condition}</div>
            </div>
          </div>
          
          {/* Feels Like */}
          <div className="text-right">
            <div className="flex items-center justify-end space-x-1 text-xs text-white/80">
              <AnimatedIcon 
                icon={Thermometer} 
                animationType="breathe" 
                size="w-3 h-3"
                className="text-cyan-400"
              />
              <span>Feels Like</span>
            </div>
            <div className="text-sm font-semibold text-cyan-300">{weather.feelsLike}°C</div>
          </div>
        </div>

        {/* Tomorrow's Forecast */}
        <div className="border-t border-white/10 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AnimatedIcon 
                icon={Calendar} 
                animationType="wave" 
                size="w-3 h-3"
                className="text-cyan-400"
              />
              <span className="text-cyan-300 font-semibold text-xs">Tomorrow</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                {getWeatherIcon(getTomorrowCondition(), "w-4 h-4")}
                <span className="text-white font-semibold text-xs">
                  {weather.tomorrow.temperature}°C
                </span>
              </div>
              
              <div className="text-xs text-white/70">
                <span className="text-white">H:{weather.tomorrow.high}°</span>
                <span className="ml-1">L:{weather.tomorrow.low}°</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        /* Custom Animation Keyframes */
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
        
        @keyframes sway {
          0%, 100% { transform: translateX(0px) rotate(0deg); }
          25% { transform: translateX(-2px) rotate(-1deg); }
          75% { transform: translateX(2px) rotate(1deg); }
        }
        
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        
        /* Animation Classes */
        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        .animate-bounce-subtle {
          animation: bounce-subtle 1.5s ease-in-out infinite;
        }
        
        .animate-wave {
          animation: wave 3s ease-in-out infinite;
        }
        
        .animate-focus {
          animation: focus 3s ease-in-out infinite;
        }
        
        .animate-sweep {
          animation: sweep 4s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animate-glow-cycle {
          animation: glow-cycle 3s ease-in-out infinite;
        }
        
        .animate-sway {
          animation: sway 3s ease-in-out infinite;
        }
        
        .animate-breathe {
          animation: breathe 2s ease-in-out infinite;
        }
      `}</style>
    </EnhancedWeatherBox>
  );
};

export default Weather;
