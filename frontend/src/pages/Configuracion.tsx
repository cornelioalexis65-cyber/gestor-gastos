export function Configuracion() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Configuración</h1>
        <p className="text-[var(--color-text-secondary)] mt-1">Preferencias de la aplicación</p>
      </div>

      <div className="card">
        <div className="card-body">
          <h2 className="text-lg font-semibold mb-4">General</h2>
          <div className="space-y-4">
            <div>
              <label className="label">Moneda</label>
              <select className="input">
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>MXN ($)</option>
              </select>
            </div>
            <div>
              <label className="label">Formato de fecha</label>
              <select className="input">
                <option>DD/MM/YYYY</option>
                <option>MM/DD/YYYY</option>
                <option>YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h2 className="text-lg font-semibold mb-4">Base de Datos</h2>
          <p className="text-[var(--color-text-secondary)]">
            Conectado a Turso (libSQL)
          </p>
        </div>
      </div>
    </div>
  )
}