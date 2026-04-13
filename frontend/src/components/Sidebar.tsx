import { LayoutDashboard, Users, Settings, FileText, HelpCircle } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '#' },
    { icon: <Users size={20} />, label: 'Users', href: '#' },
    { icon: <FileText size={20} />, label: 'Reports', href: '#' },
    { icon: <Settings size={20} />, label: 'Settings', href: '#' },
    { icon: <HelpCircle size={20} />, label: 'Help', href: '#' },
  ];

  return (
    <aside className="w-64 bg-slate-800 text-white min-h-screen flex flex-col fixed left-0 top-0">
      <div className="p-4 text-xl font-bold border-b border-slate-700">
        BuildX Admin
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <a
                href={item.href}
                className="flex items-center gap-3 p-2 rounded hover:bg-slate-700 transition-colors"
              >
                {item.icon}
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-slate-700 text-sm text-slate-400">
        v1.0.0
      </div>
    </aside>
  );
};

export default Sidebar;
