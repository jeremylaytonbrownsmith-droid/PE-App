import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from './navItems';

export function Sidebar() {
  return (
    <aside className="no-print hidden md:flex md:w-56 md:flex-col md:border-r md:border-gray-200 md:bg-white md:py-6">
      <div className="px-5 mb-6 flex items-center gap-2">
        <img src="/icons/icon.svg" alt="" className="w-8 h-8 rounded-lg" />
        <span className="font-bold text-lg text-gray-900">PE Planner</span>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                isActive ? 'bg-brand-100 text-brand-800' : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <p className="px-5 text-xs text-gray-400">Free &amp; open lesson plans for PE teachers everywhere.</p>
    </aside>
  );
}
