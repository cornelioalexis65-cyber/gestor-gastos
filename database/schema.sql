-- ===========================================
-- GESTOR DE GASTOS - Database Schema
-- ===========================================
-- Run this file to create all tables, indexes, and triggers
-- For Turso/libSQL

-- Tabla de categorías
CREATE TABLE IF NOT EXISTS categorias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE,
    tipo TEXT NOT NULL CHECK (tipo IN ('ingreso', 'gasto', 'ambos')),
    color TEXT DEFAULT '#6366f1',
    icono TEXT DEFAULT 'folder',
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de ingresos
CREATE TABLE IF NOT EXISTS ingresos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha DATE NOT NULL,
    monto REAL NOT NULL CHECK (monto > 0),
    descripcion TEXT NOT NULL,
    categoria_id INTEGER NOT NULL,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE RESTRICT
);

-- Tabla de gastos
CREATE TABLE IF NOT EXISTS gastos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha DATE NOT NULL,
    monto REAL NOT NULL CHECK (monto > 0),
    descripcion TEXT NOT NULL,
    categoria_id INTEGER NOT NULL,
    tarjeta_id INTEGER,
    tipo_pago TEXT NOT NULL DEFAULT 'efectivo' CHECK (tipo_pago IN ('efectivo', 'debito', 'credito')),
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE RESTRICT,
    FOREIGN KEY (tarjeta_id) REFERENCES tarjetas(id) ON DELETE SET NULL
);

-- Tabla de tarjetas de crédito
CREATE TABLE IF NOT EXISTS tarjetas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    limite_credito REAL NOT NULL CHECK (limite_credito > 0),
    dia_corte INTEGER NOT NULL CHECK (dia_corte BETWEEN 1 AND 31),
    dia_pago INTEGER NOT NULL CHECK (dia_pago BETWEEN 1 AND 31),
    saldo_actual REAL NOT NULL DEFAULT 0 CHECK (saldo_actual >= 0),
    color TEXT DEFAULT '#3b82f6',
    activa BOOLEAN DEFAULT 1,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de pagos de tarjeta
CREATE TABLE IF NOT EXISTS pagos_tarjeta (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tarjeta_id INTEGER NOT NULL,
    fecha DATE NOT NULL,
    monto REAL NOT NULL CHECK (monto > 0),
    descripcion TEXT,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tarjeta_id) REFERENCES tarjetas(id) ON DELETE CASCADE
);

-- Índices para consultas frecuentes
CREATE INDEX IF NOT EXISTS idx_ingresos_fecha ON ingresos(fecha);
CREATE INDEX IF NOT EXISTS idx_ingresos_categoria ON ingresos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_gastos_fecha ON gastos(fecha);
CREATE INDEX IF NOT EXISTS idx_gastos_categoria ON gastos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_gastos_tarjeta ON gastos(tarjeta_id);
CREATE INDEX IF NOT EXISTS idx_pagos_tarjeta_fecha ON pagos_tarjeta(fecha);
CREATE INDEX IF NOT EXISTS idx_pagos_tarjeta_tarjeta ON pagos_tarjeta(tarjeta_id);

-- Triggers para actualizar updated_at automáticamente
CREATE TRIGGER IF NOT EXISTS update_categorias_timestamp
AFTER UPDATE ON categorias
BEGIN
    UPDATE categorias SET actualizado_en = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_ingresos_timestamp
AFTER UPDATE ON ingresos
BEGIN
    UPDATE ingresos SET actualizado_en = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_gastos_timestamp
AFTER UPDATE ON gastos
BEGIN
    UPDATE gastos SET actualizado_en = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_tarjetas_timestamp
AFTER UPDATE ON tarjetas
BEGIN
    UPDATE tarjetas SET actualizado_en = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_pagos_tarjeta_timestamp
AFTER UPDATE ON pagos_tarjeta
BEGIN
    UPDATE pagos_tarjeta SET creado_en = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;