-- =============================================================
-- AUTODESK CONSTRUCTION CLOUD INTEGRATION
-- Run this migration to add ACC support to CuadrosCalidad
-- =============================================================

-- Add ACC project mapping columns to fact_proyecto_cc
ALTER TABLE fact_proyecto_cc
  ADD COLUMN acc_project_id VARCHAR(120) NULL AFTER codigo_laboratorio,
  ADD COLUMN acc_container_id VARCHAR(120) NULL AFTER acc_project_id;

-- OAuth token storage
CREATE TABLE IF NOT EXISTS dim_autodesk_token_cc (
  id INT NOT NULL AUTO_INCREMENT,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at DATETIME NOT NULL,
  created_on DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_on DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- Unique indexes for upsert support (prevent duplicate ACC codes per project)
ALTER TABLE fact_ubicacion_cc ADD UNIQUE INDEX uq_ubicacion_acc (id_proyecto_cc, cod_acc);
ALTER TABLE fact_piso_cc ADD UNIQUE INDEX uq_piso_acc (id_proyecto_cc, cod_acc);
