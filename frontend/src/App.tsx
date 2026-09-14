import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/shared/components/layout/Layout'
import { Dashboard } from '@/features/dashboard/Dashboard'
import { Ingresos } from '@/features/ingresos/Ingresos'
import { Gastos } from '@/features/gastos/Gastos'
import { Categorias } from '@/features/categorias/Categorias'
import { Tarjetas } from '@/features/tarjetas/Tarjetas'
import { Reportes } from '@/features/reportes/Reportes'
import { Configuracion } from '@/features/configuracion/Configuracion'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/ingresos" element={<Ingresos />} />
        <Route path="/gastos" element={<Gastos />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/tarjetas" element={<Tarjetas />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/configuracion" element={<Configuracion />} />
      </Route>
    </Routes>
  )
}

export default App