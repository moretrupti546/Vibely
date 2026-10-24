import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Library, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const MobileNav = () => {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-vibely-surface/95 backdrop-blur-xl border-t border-vibely-border flex items-center justify-around z-40 px-2">
      <NavLink
        to="/app"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
            isActive ? 'text-purple-400' : 'text-slate-400 hover:text-white'
          }`
        }
      >
        <Home className="w-5 h-5" />
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/explore"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
            isActive ? 'text-purple-400' : 'text-slate-400 hover:text-white'
          }`
        }
      >
        <Compass className="w-5 h-5" />
        <span>Explore</span>
      </NavLink>

      <NavLink
        to="/library"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
            isActive ? 'text-purple-400' : 'text-slate-400 hover:text-white'
          }`
        }
      >
        <Library className="w-5 h-5" />
        <span>Library</span>
      </NavLink>

      <NavLink
        to={isAuthenticated ? '/profile' : '/login'}
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
            isActive ? 'text-purple-400' : 'text-slate-400 hover:text-white'
          }`
        }
      >
        <User className="w-5 h-5" />
        <span>{isAuthenticated ? 'Profile' : 'Log In'}</span>
      </NavLink>
    </nav>
  );
};
