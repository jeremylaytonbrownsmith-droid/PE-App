import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from './navItems';

export function BottomNav() {
  return (
    <nav className="no-print fixed bottom-0 inset-x-0 z-20 border-t border-gray-200 bg-white/95 backdrop-blur md:hidden">
      <ul className="flex justify-between px-1" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-2 text-xs ${isActive ? 'text-brand-700' : 'text-gray-500'}`
              }
            >
              <Icon size={20} />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
