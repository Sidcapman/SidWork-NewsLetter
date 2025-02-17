import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Terminal, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const customTheme = {
  default: {
    colors: {
      brand: '#22c55e',
      brandAccent: '#16a34a',
      inputBackground: 'black',
      inputBorder: '#22c55e',
      inputText: '#22c55e',
      inputPlaceholder: '#22c55e50',
    },
    fonts: {
      bodyFontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      buttonFontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      labelFontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    },
    fontSizes: {
      baseBodySize: "14px",
      baseLabelSize: "14px",
    },
    space: {
      inputPadding: '12px',
      buttonPadding: '12px',
    },
    borderWidths: {
      buttonBorderWidth: '2px',
      inputBorderWidth: '2px',
    },
    radii: {
      borderRadiusButton: '8px',
      buttonBorderRadius: '8px',
      inputBorderRadius: '8px',
    },
    labels: {
      email: "EMAIL ADDRESS",
      password: "PASSWORD",
    },
  },
};

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const terminalRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (terminalRef.current) {
        const rect = terminalRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        
        terminalRef.current.style.setProperty('--cursor-x', `${x * 100}%`);
        terminalRef.current.style.setProperty('--cursor-y', `${y * 100}%`);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  React.useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        setIsLoading(true);
        // Simulate loading for better UX
        await new Promise(resolve => setTimeout(resolve, 1000));
        navigate('/');
      }
    });
  }, [navigate]);

  return (
    <div className="max-w-md mx-auto mt-16">
      <div 
        ref={terminalRef}
        className="mb-8 text-center relative"
        style={{
          '--cursor-x': '50%',
          '--cursor-y': '50%'
        } as React.CSSProperties}
      >
        <div className="w-24 h-24 mx-auto mb-6 relative">
          <Terminal className="w-full h-full text-green-500" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/20 to-transparent animate-scanner" />
        </div>
        <h1 className="text-3xl font-bold text-green-400 mb-4 glitch" data-text="Welcome Back_">
          Welcome Back_
        </h1>
        <p className="text-green-300 font-sans">Sign in to continue to your account</p>
      </div>

      {isLoading ? (
        <div className="border border-green-500 rounded-lg p-6 bg-black/50 backdrop-blur">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative w-16 h-16">
              <Loader2 className="w-16 h-16 animate-spin text-green-500" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-ping" />
              </div>
            </div>
            <p className="text-green-400 animate-pulse font-sans">Accessing secure terminal...</p>
          </div>
        </div>
      ) : (
        <div className="border border-green-500 rounded-lg p-6 bg-black/50 backdrop-blur">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: customTheme,
              className: {
                label: 'font-sans tracking-wide text-xs uppercase font-medium mb-1',
                input: 'font-sans',
                button: 'font-sans',
                anchor: 'font-sans',
              },
            }}
            theme="dark"
            providers={[]}
          />
        </div>
      )}

      <div className="mt-8 text-center">
        {/* <p className="text-green-300 text-sm font-sans">
          Default admin credentials:<br />
          Email: anugamsiddy@gmail.com<br />
          Password: anugam@2001
        </p> */}
      </div>

      <style>{`
        @keyframes scanner {
          0%, 100% { transform: translateY(-100%); }
          50% { transform: translateY(100%); }
        }

        .animate-scanner {
          animation: scanner 2s linear infinite;
        }

        .glitch {
          position: relative;
          text-shadow: 0.05em 0 0 rgba(255,0,0,0.75),
                      -0.025em -0.05em 0 rgba(0,255,0,0.75),
                      0.025em 0.05em 0 rgba(0,0,255,0.75);
          animation: glitch 500ms infinite;
        }

        @keyframes glitch {
          0% { text-shadow: 0.05em 0 0 rgba(34,197,94,0.75),
                          -0.05em -0.025em 0 rgba(34,197,94,0.75),
                          -0.025em 0.05em 0 rgba(34,197,94,0.75); }
          14% { text-shadow: 0.05em 0 0 rgba(34,197,94,0.75),
                          -0.05em -0.025em 0 rgba(34,197,94,0.75),
                          -0.025em 0.05em 0 rgba(34,197,94,0.75); }
          15% { text-shadow: -0.05em -0.025em 0 rgba(34,197,94,0.75),
                          0.025em 0.025em 0 rgba(34,197,94,0.75),
                          -0.05em -0.05em 0 rgba(34,197,94,0.75); }
          49% { text-shadow: -0.05em -0.025em 0 rgba(34,197,94,0.75),
                          0.025em 0.025em 0 rgba(34,197,94,0.75),
                          -0.05em -0.05em 0 rgba(34,197,94,0.75); }
          50% { text-shadow: 0.025em 0.05em 0 rgba(34,197,94,0.75),
                          0.05em 0 0 rgba(34,197,94,0.75),
                          0 -0.05em 0 rgba(34,197,94,0.75); }
          99% { text-shadow: 0.025em 0.05em 0 rgba(34,197,94,0.75),
                          0.05em 0 0 rgba(34,197,94,0.75),
                          0 -0.05em 0 rgba(34,197,94,0.75); }
          100% { text-shadow: -0.025em 0 0 rgba(34,197,94,0.75),
                          -0.025em -0.025em 0 rgba(34,197,94,0.75),
                          -0.025em -0.05em 0 rgba(34,197,94,0.75); }
        }

        /* Override Supabase Auth UI styles */
        .supabase-auth-ui_ui-container input {
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
          letter-spacing: 0.025em !important;
        }

        .supabase-auth-ui_ui-container label {
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
          letter-spacing: 0.1em !important;
          font-weight: 500 !important;
          font-size: 0.75rem !important;
          text-transform: uppercase !important;
        }

        .supabase-auth-ui_ui-container button {
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
          letter-spacing: 0.025em !important;
          font-weight: 500 !important;
        }
      `}</style>
    </div>
  );
}