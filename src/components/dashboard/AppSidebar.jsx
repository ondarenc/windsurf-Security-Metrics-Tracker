import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { cn } from '../../lib/utils'
import {
  Gauge,
  Shield,
  Server,
  Cloud,
  Search,
  Settings,
  Home,
  BarChart3,
  FileText,
  AlertTriangle,
} from 'lucide-react'

const overviewMenu = [
  { id: 'overview', label: 'Overview', path: '/', icon: Gauge },
]

const mainMenu = [
  { id: 'm365', label: 'M365 Secure Score', path: '/m365', icon: Shield },
  { id: 'purple-knight-ad', label: 'Purple Knight AD', path: '/purple-knight-ad', icon: Server },
  { id: 'purple-knight-entra-id', label: 'Purple Knight Entra-ID', path: '/purple-knight-entra-id', icon: Cloud },
  { id: 'security-scorecard', label: 'Security Scorecard', path: '/security-scorecard', icon: BarChart3 },
  { id: 'project-discovery', label: 'Project Discovery', path: '/project-discovery', icon: Search },
]

const vulnerabilitiesMenu = [
  { id: 'followup', label: 'Follow-up', path: '/followup', icon: AlertTriangle },
]

const bottomMenu = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: Home },
  { id: 'settings', label: 'Settings', path: '/dashboard?settings=open', icon: Settings },
]

export function AppSidebar({ className }) {
  const location = useLocation()

  return (
    <aside className={cn('w-[260px] h-screen bg-card border-r border-border flex flex-col shrink-0', className)}>
      {/* Logo */}
      <div className="h-16 px-5 flex items-center gap-3 border-b border-border">
        <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center">
          <img src="/u.png" alt="Uditis" className="w-6 h-6 object-contain" />
        </div>
        <span className="font-semibold text-foreground text-[15px] tracking-tight">
          Uditis
        </span>
        <span className="ml-auto px-2 py-0.5 text-[10px] font-medium bg-success/10 text-success rounded-full">
          Live
        </span>
      </div>

      {/* Main Menu */}
      <div className="px-4 py-4 flex-1 overflow-y-auto">
        <nav className="space-y-0.5 mb-6">
          {overviewMenu.map((item) => (
            <SidebarLink
              key={item.id}
              item={item}
              isActive={location.pathname === item.path}
            />
          ))}
        </nav>

        <p className="px-2 mb-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
          Metrics
        </p>
        <nav className="space-y-0.5 mb-6">
          {mainMenu.map((item) => (
            <SidebarLink
              key={item.id}
              item={item}
              isActive={location.pathname === item.path}
            />
          ))}
        </nav>

        <p className="px-2 mb-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
          Vulnerabilities
        </p>
        <nav className="space-y-0.5">
          {vulnerabilitiesMenu.map((item) => (
            <SidebarLink
              key={item.id}
              item={item}
              isActive={location.pathname === item.path}
            />
          ))}
        </nav>
      </div>

      {/* Bottom Menu */}
      <div className="px-4 py-4 border-t border-border space-y-0.5">
        {bottomMenu.map((item) => (
          <SidebarLink
            key={item.id}
            item={item}
            isActive={location.pathname + location.search === item.path}
          />
        ))}
      </div>
    </aside>
  )
}

function SidebarLink({ item, isActive }) {
  const Icon = item.icon
  return (
    <NavLink
      to={item.path}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        isActive
          ? 'bg-primary text-primary-foreground font-medium shadow-sm'
          : 'text-foreground/80 hover:bg-muted/80 hover:text-foreground'
      )}
    >
      <Icon className="w-[18px] h-[18px] shrink-0" />
      <span className="flex-1 text-left">{item.label}</span>
    </NavLink>
  )
}
