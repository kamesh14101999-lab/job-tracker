import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 text-lg">
            💼
          </span>
          <h1 className="text-lg font-semibold tracking-tight text-white">
            Job Application Tracker
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <span className="hidden text-sm text-indigo-100 sm:inline">
              Hi, {user.name.split(' ')[0]}
            </span>
          )}
          <button
            type="button"
            onClick={logout}
            className="rounded-md bg-white/10 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-white/20"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
