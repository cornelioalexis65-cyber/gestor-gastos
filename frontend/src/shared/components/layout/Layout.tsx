import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, ArrowDownToLine, Receipt, PieChart, Settings, FolderOpen, CreditCard, ArrowLeft, Wallet } from 'lucide-react'
import { useState } from 'react'

type NavItem = { path: string; label: string; icon: typeof LayoutDashboard }
type NavGroup = { label: string; items: NavItem[] }

const navigation: NavGroup[] = [
  {
    label: 'Inicio',
    items: [{ path: '/', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Movimientos',
    items: [
      { path: '/ingresos', label: 'Ingresos', icon: ArrowDownToLine },
      { path: '/gastos', label: 'Gastos', icon: Receipt },
    ],
  },
  {
    label: 'Organización',
    items: [
      { path: '/categorias', label: 'Categorías', icon: FolderOpen },
      { path: '/tarjetas', label: 'Tarjetas', icon: CreditCard },
    ],
  },
  {
    label: 'Análisis',
    items: [{ path: '/reportes', label: 'Reportes', icon: PieChart }],
  },
  {
    label: 'General',
    items: [{ path: '/configuracion', label: 'Configuración', icon: Settings }],
  },
]

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[var(--sidebar-width)] bg-[var(--color-bg-card)] border-r border-[var(--color-border)] transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Navegación principal"
      >
        <div className="flex h-[var(--header-height)] items-center justify-between px-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--color-primary)] text-white">
              <Wallet size={18} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h1 className="text-base font-bold leading-tight text-[var(--color-text)]">Gestor de Gastos</h1>
              <p className="text-xs text-[var(--color-text-secondary)] leading-tight">Finanzas personales</p>
            </div>
          </div>
          <button
            className="lg:hidden p-2 rounded-md text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]"
            onClick={() => setSidebarOpen(false)}
            aria-label="Cerrar menú"
          >
            <ArrowLeft size={20} />
          </button>
        </div>

        <nav className="p-3 space-y-1" aria-label="Navegación">
          {navigation.map(group => (
            <div key={group.label}>
              <span className="nav-label">{group.label}</span>
              {group.items.map(item => {
                const isActive = location.pathname === item.path
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-border)] hover:text-[var(--color-text)]'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r bg-[var(--color-primary)]" aria-hidden="true" />}
                    <item.icon size={20} aria-hidden="true" />
                    {item.label}
                  </NavLink>
                )
              })}
            </div>
          ))}
        </nav>

        <div className="absolute bottom-4 left-0 right-0 px-6">
          <p className="text-xs text-[var(--color-text-secondary)]">v1.0.0</p>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-[var(--sidebar-width)] min-w-0">
        {/* Top header */}
        <header className="sticky top-0 z-30 h-[var(--header-height)] bg-[var(--color-bg-card)] border-b border-[var(--color-border)] lg:hidden">
          <div className="flex h-full items-center justify-between px-4">
            <button
              className="p-2 rounded-md text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]"
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir menú"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-[var(--color-primary)]">Gestor de Gastos</h1>
            <div className="w-10" />
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6" id="main-content" role="main">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}