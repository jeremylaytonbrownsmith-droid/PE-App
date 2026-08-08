import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="text-center py-16">
      <p className="text-lg font-semibold text-gray-800">Page not found</p>
      <Link to="/" className="text-brand-700 underline text-sm mt-2 inline-block">
        Back to Home
      </Link>
    </div>
  );
}
