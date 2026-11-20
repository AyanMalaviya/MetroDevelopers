// src/components/Layout/ProjectsSidebar.jsx
import { NavLink } from 'react-router-dom';
import { Building2, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const SIDEBAR_LINKS = [
  { to: '/projects/ongoing', label: 'Ongoing', icon: Building2    },
  { to: '/projects/past',    label: 'Past',    icon: CheckCircle2 },
];

const ProjectsSidebar = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const bgSurface = isDark ? 'bg-[#121215]/95' : 'bg-[#FFFFFF]/95';
  const border    = isDark ? 'border-white/[0.12]' : 'border-black/[0.12]';
  const divide    = isDark ? 'divide-white/[0.12]' : 'divide-black/[0.12]';
  const textMain  = isDark ? 'text-[#F5F4F0]' : 'text-[#121214]';
  const textMuted = isDark ? 'text-[#A0A0A8]' : 'text-[#4E4E55]';

  return (
    <aside
      aria-label="Project status navigation"
      className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30"
    >
      <nav
        className={`border ${border} ${bgSurface} backdrop-blur-md divide-y ${divide} shadow-xl`}
      >
        {SIDEBAR_LINKS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `relative flex flex-col items-center justify-center gap-1.5 px-3.5 py-3.5 transition-colors ${
                isActive
                  ? 'bg-brand-red text-white'
                  : `${textMuted} hover:${isDark ? 'bg-[#17171B]' : 'bg-[#FAF9F6]'} hover:${textMain}`
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={16} className={isActive ? 'text-white' : 'text-brand-red'} aria-hidden="true" />
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] whitespace-nowrap">
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default ProjectsSidebar;