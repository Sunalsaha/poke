import { useState, useEffect } from 'react';
import Header from './components/Header';
import SystemInfo from './components/SystemInfo';
import PicoLogo from './components/PicoLogo';

import circuitBackground from './assets/circuit-background.gif';

function App() {
  const [picoState, setPicoState] = useState<'trying' | 'connected' | 'cannot' | 'idle' | 'listening' | 'thinking' | 'preparing'>('trying');
  const systemData = {};

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (picoState === 'trying') {
      // Simulate connection attempt (3 seconds)
      timer = setTimeout(() => {
        // Randomly decide if connected or cannot connect for demo
        // In real implementation, replace with actual connection logic
        const rand = Math.random();
        if (rand > 0.3) {
          setPicoState('connected');
        } else {
          setPicoState('cannot');
        }
      }, 3000);
    } else if (picoState === 'cannot') {
      // Auto retry after 5 seconds
      timer = setTimeout(() => {
        setPicoState('trying');
      }, 5000);
    } else if (picoState === 'connected') {
      // After successful connection, transition to idle after 2 seconds
      timer = setTimeout(() => {
        setPicoState('idle');
      }, 2000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [picoState]);

  return (
    <>
      <style>{`
        /* Connection Status Animations */
        .connection-status {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          color: white;
          font-size: 1.2rem;
          z-index: 20;
        }

        .status-animation {
          margin-top: 15px;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 15px;
        }

        /* TRYING TO CONNECT - Spinner Animation */
        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(0, 255, 255, 0.3);
          border-top: 3px solid #00ffff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* CONNECTED - Success Pulse Animation */
        .success-pulse {
          width: 40px;
          height: 40px;
          background: rgba(0, 255, 0, 0.8);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: white;
          font-weight: bold;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }

        /* CANNOT CONNECT - Error Shake Animation */
        .error-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
        }

        .error-shake {
          width: 40px;
          height: 40px;
          background: rgba(255, 6, 6, 1);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: white;
          font-weight: bold;
          animation: shake 0.6s ease-in-out infinite;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }

        /* Logo State Effects */
        .pico-trying {
          filter: brightness(0.8) saturate(0.9);
          animation: logoTrying 2s ease-in-out infinite;
        }

        .pico-connected {
          filter: brightness(1.2) saturate(1.3) hue-rotate(90deg);
          transform: scale(1.05);
          transition: all 0.5s ease;
        }

        .pico-cannot {
          filter: brightness(0.6) saturate(1.5) hue-rotate(0deg);
          animation: logoError 0.5s ease-in-out;
        }

        @keyframes logoTrying {
          0%, 100% { 
            filter: brightness(0.8) saturate(0.9);
          }
          50% { 
            filter: brightness(1.0) saturate(1.1);
          }
        }

        @keyframes logoError {
          0%, 100% { transform: translateX(0) scale(1); }
          25% { transform: translateX(-3px) scale(0.98); }
          75% { transform: translateX(3px) scale(0.98); }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .connection-status {
            font-size: 1rem;
          }
          
          .spinner, .success-pulse, .error-shake {
            width: 30px;
            height: 30px;
            font-size: 1.2rem;
          }
        }
      `}</style>

      <div className="min-h-screen text-white font-mono overflow-hidden relative select-none" style={{ backgroundColor: 'black' }}>
        {/* Enhanced GIF Background with Better Resolution Handling */}
        <div className="fixed inset-0 z-0">
          <div className="w-full h-full relative overflow-hidden">
            <img 
              src={circuitBackground}
              alt="Digital Circuit Board Background"
              className="absolute inset-0 w-full h-full object-cover opacity-80"
              style={{
                filter: 'brightness(0.7) contrast(1.2) saturate(1.1)',
                mixBlendMode: 'normal',
                imageRendering: 'crisp-edges',
                backfaceVisibility: 'hidden',
                transform: 'translateZ(0)',
              } as React.CSSProperties}
              loading="eager"
              decoding="sync"
            />
            
            {/* Enhanced overlay for better text readability */}
            <div 
              className="absolute inset-0 bg-black/40"
              style={{
                background: `
                  radial-gradient(circle at 25% 25%, rgba(0, 255, 255, 0.02) 0%, transparent 50%),
                  radial-gradient(circle at 75% 75%, rgba(0, 255, 255, 0.02) 0%, transparent 50%),
                  rgba(0, 0, 0, 0.4)
                `
              }}
            ></div>
          </div>
        </div>

        {/* Main Container with Enhanced Structure */}
        <div className="relative z-10 h-screen flex flex-col">
          <Header />

          <div className="flex-1 flex gap-6 p-6">
            {/* Left Panel */}
            <div className="flex-1 flex flex-col gap-6">
              <div className="flex-1">
                <SystemInfo systemData={systemData} side="left" />
              </div>
            </div>

            {/* Center */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className={`pico-${picoState}`}>
                <PicoLogo state={picoState} onStateChange={setPicoState} />
              </div>
            </div>

            {/* Right Panel */}
            <div className="flex-1 flex flex-col">
              <div className="flex-1">
                <SystemInfo systemData={systemData} side="right" />
              </div>
            </div>
          </div>

          {/* Connection Status Display - Only show for connection states */}
          {['trying', 'connected', 'cannot'].includes(picoState) && (
            <div className="connection-status">
              <div className="status-message">
                {picoState === 'trying' && ''}
                {picoState === 'connected' && ''}
                {picoState === 'cannot' && ''}
              </div>
              
              <div className="status-animation">
                {picoState === 'trying' && <div className="spinner"></div>}
                {picoState === 'connected' && <div className="success-pulse">✓</div>}
                {picoState === 'cannot' && (
                  <div className="error-container">
                    <div className="error-shake">✗</div>
                   
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
