import { Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { Dashboard } from '@/pages/Dashboard'
import { Ingresos } from '@/pages/Ingresos'
import { Gastos } from '@/pages/Gastos'
import { Categorias } from '@/pages/Categorias'
import { Tarjetas } from '@/pages/Tarjetas'
import { Reportes } from '@/pages/Reportes'
import { Configuracion } from '@/pages/Configuracion'

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