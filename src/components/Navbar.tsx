import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Terminal, LogOut, Shield, PenTool, Code2, Braces } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = React.useState<any>(null);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      checkAdminStatus(session?.user);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      checkAdminStatus(session?.user);
    });
  }, []);

  const checkAdminStatus = async (user: any) => {
    if (!user) {
      setIsAdmin(false);
      return;
    }

    const { data: { role } } = await supabase.auth.getUser();
    setIsAdmin(role === 'admin');
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <nav className="border-b border-green-500 bg-black">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center space-x-2 group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="relative w-10 h-10">
              {/* Animated Terminal Icon */}
              <Terminal 
                className={`w-10 h-10 text-green-500 absolute transition-all duration-300 transform
                  ${isHovered ? 'scale-0 rotate-180 opacity-0' : 'scale-100 rotate-0 opacity-100'}`}
              />
              {/* Animated Code Brackets */}
              <div className={`absolute inset-0 transition-all duration-300 transform
                ${isHovered ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                <Braces className="w-10 h-10 text-green-500 absolute" />
                <Code2 className="w-10 h-10 text-green-400 absolute animate-pulse" />
              </div>
              {/* Glowing Effect */}
              <div className={`absolute inset-0 bg-green-500 rounded-full filter blur-xl transition-opacity duration-300
                ${isHovered ? 'opacity-20' : 'opacity-0'}`} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-wider">
                <span className="text-green-400">Tech</span>
                <span className="text-green-500">Log_</span>
              </span>
              <span className="text-xs text-green-400/60 tracking-widest transform transition-all duration-300
                -translate-y-1 font-mono">
                {isHovered ? '> echo "welcome"' : '> _'}
              </span>
            </div>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link to="/" className="hover:text-green-300 transition-colors">
              Home
            </Link>
            {user ? (
              <>
                {isAdmin && (
                  <>
                    <Link to="/write" className="hover:text-green-300 transition-colors flex items-center">
                      <PenTool className="w-4 h-4 mr-1" />
                      Write
                    </Link>
                    <Link to="/admin" className="hover:text-green-300 transition-colors flex items-center">
                      <Shield className="w-4 h-4 mr-1" />
                      Admin
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 hover:text-green-300 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link to="/login" className="hover:text-green-300 transition-colors">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}