import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const isActive = (path: string) => location.pathname === path;

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case UserRole.STORE_OWNER:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const formatRole = (role: UserRole) => {
    return role
      .split('_')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className="flex items-center space-x-2 font-display text-xl font-bold tracking-tight text-slate-900"
            >
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
              <span>RateStore</span>
            </Link>

            <div className="hidden md:flex items-center space-x-1">
              {user.role === UserRole.ADMIN && (
                <>
                  <Link
                    to="/admin/dashboard"
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive('/admin/dashboard')
                        ? 'bg-slate-100 text-slate-900'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/users"
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive('/admin/users')
                        ? 'bg-slate-100 text-slate-900'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    Users
                  </Link>
                  <Link
                    to="/admin/stores"
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive('/admin/stores')
                        ? 'bg-slate-100 text-slate-900'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    Stores
                  </Link>
                </>
              )}

              {user.role === UserRole.NORMAL_USER && (
                <Link
                  to="/stores"
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive('/stores')
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  Stores
                </Link>
              )}

              {user.role === UserRole.STORE_OWNER && (
                <Link
                  to="/owner/dashboard"
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive('/owner/dashboard')
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  My Store
                </Link>
              )}

              <Link
                to="/change-password"
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive('/change-password')
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                Change Password
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-end text-right">
              <span className="text-sm font-semibold text-slate-800">{user.name}</span>
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${getRoleBadgeColor(
                  user.role
                )}`}
              >
                {formatRole(user.role)}
              </span>
            </div>

            <button
              onClick={logout}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
