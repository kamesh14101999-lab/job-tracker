import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <h1 className="text-5xl font-bold text-slate-900">404</h1>
      <p className="mt-2 text-slate-500">This page doesn't exist.</p>
      <Link to="/" className="mt-6 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500">
        Back to dashboard
      </Link>
    </div>
  );
}
