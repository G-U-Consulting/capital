-- =============================================================
-- CUADROS DE CALIDAD TABLES
-- Add to existing database (no separate schema)
-- Suffix: _cc (cuadros calidad)
-- =============================================================

-- -----------------------------------------------------
-- dim_laboratorio_cc (Laboratories)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dim_laboratorio_cc` (
  `id_laboratorio` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `logo` VARCHAR(120) NULL,
  `created_on` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` VARCHAR(200) NOT NULL,
  `is_active` BIT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_laboratorio`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- -----------------------------------------------------
-- dim_concretera_cc (Concrete plants)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dim_concretera_cc` (
  `id_concretera` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `logo` VARCHAR(120) NULL,
  `created_on` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` VARCHAR(200) NOT NULL,
  `is_active` BIT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_concretera`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- -----------------------------------------------------
-- dim_clase_muestra_cc (Sample class: Concreto, Mamposteria)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dim_clase_muestra_cc` (
  `id_clase_muestra` INT NOT NULL AUTO_INCREMENT,
  `descripcion` VARCHAR(45) NOT NULL,
  `is_active` BIT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_clase_muestra`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- -----------------------------------------------------
-- dim_tipo_muestra_cc (Sample type: 6 cilindros, 9 cilindros, mortero)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dim_tipo_muestra_cc` (
  `id_tipo_muestra` INT NOT NULL AUTO_INCREMENT,
  `id_clase_muestra` INT NOT NULL,
  `descripcion` VARCHAR(45) NOT NULL,
  `rango_verde` DECIMAL(15,3) NOT NULL,
  `rango_amarillo` DECIMAL(15,3) NOT NULL,
  `rango_rojo` DECIMAL(15,3) NOT NULL,
  `diametro` VARCHAR(10) NULL,
  `is_active` BIT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_tipo_muestra`),
  INDEX `fk_tipo_muestra_cc_clase_idx` (`id_clase_muestra` ASC),
  CONSTRAINT `fk_tipo_muestra_cc_clase`
    FOREIGN KEY (`id_clase_muestra`)
    REFERENCES `dim_clase_muestra_cc` (`id_clase_muestra`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- -----------------------------------------------------
-- dim_edad_muestra_cc (Sample ages)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dim_edad_muestra_cc` (
  `id_edad_muestra` INT NOT NULL AUTO_INCREMENT,
  `id_tipo_muestra` INT NOT NULL,
  `edad` SMALLINT NOT NULL,
  `color` VARCHAR(45) NULL,
  `is_active` BIT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_edad_muestra`),
  INDEX `fk_edad_muestra_cc_tipo_idx` (`id_tipo_muestra` ASC),
  CONSTRAINT `fk_edad_muestra_cc_tipo`
    FOREIGN KEY (`id_tipo_muestra`)
    REFERENCES `dim_tipo_muestra_cc` (`id_tipo_muestra`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- -----------------------------------------------------
-- dim_estado_cc (Status: en proceso, entregada, terminada)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dim_estado_cc` (
  `id_estado_cc` INT NOT NULL AUTO_INCREMENT,
  `descripcion` VARCHAR(100) NOT NULL,
  `is_active` BIT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_estado_cc`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- -----------------------------------------------------
-- fact_proyecto_cc (Project-Laboratory link for CC)
-- Only this table references fact_proyectos directly.
-- All other _cc fact tables reference this table via id_proyecto_cc.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fact_proyecto_cc` (
  `id_proyecto_cc` INT NOT NULL AUTO_INCREMENT,
  `id_proyecto` INT NOT NULL,
  `id_laboratorio` INT NOT NULL,
  `codigo_laboratorio` INT NOT NULL,
  `created_on` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` VARCHAR(200) NOT NULL,
  `updated_on` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` VARCHAR(200) NULL,
  `is_active` BIT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_proyecto_cc`),
  UNIQUE INDEX `uq_proyecto_cc` (`id_proyecto` ASC),
  INDEX `fk_proyecto_cc_laboratorio_idx` (`id_laboratorio` ASC),
  CONSTRAINT `fk_proyecto_cc_proyecto`
    FOREIGN KEY (`id_proyecto`)
    REFERENCES `fact_proyectos` (`id_proyecto`),
  CONSTRAINT `fk_proyecto_cc_laboratorio`
    FOREIGN KEY (`id_laboratorio`)
    REFERENCES `dim_laboratorio_cc` (`id_laboratorio`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- -----------------------------------------------------
-- fact_ubicacion_cc (Locations synced from ACC)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fact_ubicacion_cc` (
  `id_ubicacion` INT NOT NULL AUTO_INCREMENT,
  `id_proyecto_cc` INT NOT NULL,
  `cod_acc` VARCHAR(120) NOT NULL,
  `descripcion` VARCHAR(120) NOT NULL,
  `activado_acc` TINYINT NOT NULL DEFAULT 1 COMMENT '0=desactivado en ACC, 1=activo',
  `fecha_sincronizacion` DATETIME NOT NULL,
  `created_on` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` VARCHAR(200) NOT NULL,
  `is_active` BIT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_ubicacion`),
  INDEX `fk_ubicacion_cc_proyecto_idx` (`id_proyecto_cc` ASC),
  CONSTRAINT `fk_ubicacion_cc_proyecto`
    FOREIGN KEY (`id_proyecto_cc`)
    REFERENCES `fact_proyecto_cc` (`id_proyecto_cc`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- -----------------------------------------------------
-- fact_piso_cc (Floors synced from ACC)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fact_piso_cc` (
  `id_piso` INT NOT NULL AUTO_INCREMENT,
  `id_proyecto_cc` INT NOT NULL,
  `cod_acc` VARCHAR(120) NOT NULL,
  `numero` VARCHAR(45) NOT NULL,
  `activado_acc` TINYINT NOT NULL DEFAULT 1,
  `fecha_sincronizacion` DATETIME NOT NULL,
  `created_on` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` VARCHAR(200) NOT NULL,
  `is_active` BIT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_piso`),
  INDEX `fk_piso_cc_proyecto_idx` (`id_proyecto_cc` ASC),
  CONSTRAINT `fk_piso_cc_proyecto`
    FOREIGN KEY (`id_proyecto_cc`)
    REFERENCES `fact_proyecto_cc` (`id_proyecto_cc`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- -----------------------------------------------------
-- fact_observacion_cc (Observations)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fact_observacion_cc` (
  `id_observacion` INT NOT NULL AUTO_INCREMENT,
  `id_proyecto_cc` INT NOT NULL,
  `descripcion` VARCHAR(200) NOT NULL,
  `accion` SMALLINT NULL COMMENT 'Special action trigger code',
  `created_on` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` VARCHAR(200) NOT NULL,
  `is_active` BIT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_observacion`),
  INDEX `fk_observacion_cc_proyecto_idx` (`id_proyecto_cc` ASC),
  CONSTRAINT `fk_observacion_cc_proyecto`
    FOREIGN KEY (`id_proyecto_cc`)
    REFERENCES `fact_proyecto_cc` (`id_proyecto_cc`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- -----------------------------------------------------
-- fact_parametrizacion_obra_cc (Work parameterization)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fact_parametrizacion_obra_cc` (
  `id_parametrizacion` INT NOT NULL AUTO_INCREMENT,
  `id_proyecto_cc` INT NOT NULL,
  `politica_recoleccion` SMALLINT NOT NULL DEFAULT 0 COMMENT '0=1 dia antes, 1=1 dia despues (festivos)',
  `created_on` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` VARCHAR(200) NOT NULL,
  `updated_on` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` VARCHAR(200) NULL,
  `is_active` BIT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_parametrizacion`),
  UNIQUE INDEX `uq_parametrizacion_proyecto_cc` (`id_proyecto_cc` ASC),
  CONSTRAINT `fk_param_cc_proyecto`
    FOREIGN KEY (`id_proyecto_cc`)
    REFERENCES `fact_proyecto_cc` (`id_proyecto_cc`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
