import React from 'react';
import picoImage from '../pico.png'; // Adjust the relative path if needed

interface ConnectionStatusProps {
  state?: 'trying' | 'connected' | 'cannot';
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ state = 'trying' }) => {
  const getStateConfig = () => {
    switch (state) {
      case 'trying':
        return { 
          text: 'pico is trying to connect', 
          color: '#3498db',
          glow: 'rgba(52, 152, 219, 0.8)'
        };
      case 'connected':
        return { 
          text: 'pico is connected', 
          color: '#2ecc71',
          glow: 'rgba(46, 204, 113, 0.8)'
        };
      case 'cannot':
        return { 
          text: 'pico cannot connect', 
          color: '#e74c3c',
          glow: 'rgba(231, 76, 60, 0.8)'
        };
      default:
        return { 
          text: 'pico is trying to connect', 
          color: '#3498db',
          glow: 'rgba(52, 152, 219, 0.8)'
        };
    }
  };

  const config = getStateConfig();

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Connection Status Display */}
      <div className="w-64 h-64 flex items-center justify-center">
        <div className="relative">
          {/* Image with color tint and glow */}
          <img 
            src={picoImage} 
            alt="PICO" 
            className="w-full h-full"
            style={{
              animation: state === 'trying' ? 'connectingAnimation 2s ease-in-out infinite' : 
                        state === 'connected' ? 'connectedAnimation 3s ease-in-out infinite' :
                        'cannotConnectAnimation 2s ease-in-out infinite',
              filter: `
                brightness(1.1) 
                saturate(1.2) 
                sepia(0.3)
                drop-shadow(0 0 20px ${config.glow})
                drop-shadow(0 0 40px ${config.glow})
              `,
              objectFit: 'contain',
              border: 'none',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Status Text */}
      <div className="text-center">
        <p 
          className="text-2xl font-bold transition-all duration-[1500ms] ease-in-out tracking-wide"
          style={{ 
            color: config.color,
          }}
        >
          {config.text}
        </p>

        {/* Status Indicators */}
        <div className="flex items-center justify-center space-x-3 mt-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full transition-all duration-[1200ms] ease-in-out"
              style={{ 
                backgroundColor: config.color,
                opacity: '1.0',
                transform: 'scale(1.3)',
                animation: `orbPulse 2s ease-in-out infinite ${i * 0.3}s`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
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
      `}</style>
    </div>
  );
};

export default ConnectionStatus;
