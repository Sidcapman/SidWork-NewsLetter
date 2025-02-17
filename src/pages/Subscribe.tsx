import React, { useEffect, useRef } from 'react';
import { CircuitBoard, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Button from '../components/Button';

export default function Subscribe() {
  const [email, setEmail] = React.useState('');
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = React.useState<string | null>(null);
  const robotEyesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (robotEyesRef.current) {
        const rect = robotEyesRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        
        // Limit the eye movement to stay within the eye socket
        const limitedX = Math.max(0.3, Math.min(0.7, x));
        const limitedY = Math.max(0.3, Math.min(0.7, y));
        
        robotEyesRef.current.style.setProperty('--eye-x', `${limitedX * 100}%`);
        robotEyesRef.current.style.setProperty('--eye-y', `${limitedY * 100}%`);
      }
    };

    // Add typing animation effect
    const handleKeyPress = () => {
      if (robotEyesRef.current) {
        robotEyesRef.current.classList.add('typing');
        setTimeout(() => {
          robotEyesRef.current?.classList.remove('typing');
        }, 100);
      }
    };

    // Focus on input when clicking anywhere in the form section
    const handleFormClick = (e: MouseEvent) => {
      if (inputRef.current && e.target instanceof Element && !e.target.closest('button')) {
        inputRef.current.focus();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('keypress', handleKeyPress);
    document.querySelector('.subscription-form')?.addEventListener('click', handleFormClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('keypress', handleKeyPress);
      document.querySelector('.subscription-form')?.removeEventListener('click', handleFormClick);
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setError(null);

    try {
      const { error } = await supabase
        .from('subscribers')
        .insert([{ email }]);

      if (error) throw error;
      setStatus('success');
      setEmail('');
    } catch (err) {
      console.error('Error subscribing:', err);
      setError('Failed to subscribe. Please try again.');
      setStatus('error');
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md p-8 border border-green-500 rounded-lg bg-black/50 backdrop-blur relative overflow-hidden subscription-form">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent"></div>
        
        <div className="relative">
          <div className="text-center mb-8">
            {/* Wall-E inspired robot */}
            <div 
              ref={robotEyesRef}
              className="w-32 h-32 mx-auto mb-4 relative robot-head"
              style={{
                '--eye-x': '50%',
                '--eye-y': '50%'
              } as React.CSSProperties}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg transform transition-transform duration-300"></div>
              <div className="absolute inset-4 flex items-center justify-center">
                <div className="w-16 h-8 bg-gray-700 rounded-full flex items-center justify-around p-1 overflow-hidden">
                  <div className="w-6 h-6 bg-green-400 rounded-full relative overflow-hidden robot-eye">
                    <div 
                      className="w-3 h-3 bg-black rounded-full absolute transition-all duration-100 eye-pupil"
                      style={{
                        left: 'var(--eye-x)',
                        top: 'var(--eye-y)',
                        transform: 'translate(-50%, -50%)'
                      }}
                    ></div>
                  </div>
                  <div className="w-6 h-6 bg-green-400 rounded-full relative overflow-hidden robot-eye">
                    <div 
                      className="w-3 h-3 bg-black rounded-full absolute transition-all duration-100 eye-pupil"
                      style={{
                        left: 'var(--eye-x)',
                        top: 'var(--eye-y)',
                        transform: 'translate(-50%, -50%)'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2 text-green-400">Subscribe_</h1>
            <p className="text-green-300">
              Join the network. Weekly tech insights delivered.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                ref={inputRef}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-black border border-green-500 rounded-lg focus:outline-none focus:border-green-300 text-green-400 placeholder-green-700 transition-all duration-300"
                required
              />
            </div>

            <Button
              type="submit"
              isLoading={status === 'loading'}
              className="w-full transform hover:scale-105 transition-transform duration-300"
            >
              <Send className="w-4 h-4 mr-2" />
              Subscribe_
            </Button>

            {status === 'success' && (
              <div className="bg-green-500/20 text-green-400 px-4 py-3 rounded-lg text-center animate-fadeIn">
                Successfully subscribed! Welcome aboard.
              </div>
            )}
            {error && (
              <div className="bg-red-500/20 text-red-400 px-4 py-3 rounded-lg text-center animate-fadeIn">
                {error}
              </div>
            )}
          </form>

          <div className="mt-8 text-center">
            <p className="text-green-300/60 text-sm">
              No spam. Only weekly tech insights.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .robot-head {
          transition: transform 0.3s ease;
        }
        
        .robot-head.typing {
          transform: translateY(2px);
        }
        
        .robot-eye {
          transition: all 0.3s ease;
        }
        
        .typing .robot-eye {
          height: 20px;
          transform: translateY(2px);
        }
        
        .eye-pupil {
          transition: all 0.1s ease;
        }
        
        .typing .eye-pupil {
          width: 8px;
          height: 8px;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        input:focus + .robot-head {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}