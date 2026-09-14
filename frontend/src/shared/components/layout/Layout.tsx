import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, Wallet, CreditCard, PieChart, Settings, FolderOpen, ArrowLeft } from 'lucide-react'
import { useState } from 'react'

const navigation = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/ingresos', label: 'Ingresos', icon: Wallet },
  { path: '/gastos', label: 'Gastos', icon: CreditCard },
  { path: '/categorias', label: 'Categorías', icon: FolderOpen },
  { path: '/tarjetas', label: 'Tarjetas', icon: CreditCard },
  { path: '/reportes', label: 'Reportes', icon: PieChart },
  { path: '/configuracion', label: 'Configuración', icon: Settings },
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
          <h1 className="text-xl font-bold text-[var(--color-primary)]">Gestor de Gastos</h1>
          <button
            className="lg:hidden p-2 rounded-md text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]"
            onClick={() => setSidebarOpen(false)}
            aria-label="Cerrar menú"
          >
            <ArrowLeft size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-1" aria-label="Navegación">
          {navigation.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-border)] hover:text-[var(--color-text)]'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <item.icon size={20} aria-hidden="true" />
                {item.label}
              </NavLink>
            )
          })}
        </nav>
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
          <Outlet />
        </main>
      </div>
    </div>
  )
}