-- =============================================================
-- CUADROS DE CALIDAD - OPERATIONAL TABLES
-- Based on Script 2 (legacy model) + _cc audit patterns
-- =============================================================

-- -----------------------------------------------------
-- dim_tipo_mezcla_cc (Concrete mix types)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `dim_tipo_mezcla_cc` (
  `id_tipo_mezcla` INT NOT NULL AUTO_INCREMENT,
  `descripcion` VARCHAR(100) NOT NULL,
  `resistencia` VARCHAR(45) NULL COMMENT 'Design strength e.g. 3000 PSI',
  `is_active` BIT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_tipo_mezcla`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- -----------------------------------------------------
-- fact_formato_mixer_cc
-- Based on legacy: fact_formato_ingreso_concreto
-- -----------------------------------------------------
DROP TABLE IF EXISTS `fact_formato_mixer_cc`;
CREATE TABLE IF NOT EXISTS `fact_formato_mixer_cc` (
  `id_formato_mixer` INT NOT NULL AUTO_INCREMENT,
  `id_proyecto_cc` INT NOT NULL,
  `id_concretera` INT NULL COMMENT 'Proveedor',
  `fecha` DATETIME NOT NULL COMMENT 'Fecha/hora ingreso mixer',
  `cantidad_m3` DECIMAL(15,3) NULL COMMENT 'Cantidad de concreto en m3',
  `resistencia_psi` DECIMAL(15,3) NULL COMMENT 'Resistencia esperada en PSI',
  `resistencia_mpa` DECIMAL(15,3) NULL COMMENT 'Auto-calc: PSI * 0.00689476',
  `asentamiento_esperado` DECIMAL(15,3) NULL COMMENT 'Asentamiento estimado',
  `asentamiento_real` DECIMAL(15,3) NULL COMMENT 'Asentamiento real medido',
  `temperatura` DECIMAL(10,2) NULL COMMENT 'Temperatura al momento de entrega',
  `recibido` TINYINT NOT NULL DEFAULT 0 COMMENT '1=Si, 0=No (si no se devuelve)',
  `numero_remision` VARCHAR(45) NULL COMMENT 'Numero de remision de la mixer',
  `seleccionado_muestra` TINYINT NOT NULL DEFAULT 0 COMMENT '1=muestra generada',
  `id_muestra` INT NULL COMMENT 'FK a muestra generada desde este mixer',
  `observaciones` TEXT NULL,
  `created_on` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` VARCHAR(200) NOT NULL,
  `updated_on` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` VARCHAR(200) NULL,
  `is_active` BIT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_formato_mixer`),
  INDEX `fk_mixer_proyecto_idx` (`id_proyecto_cc` ASC),
  INDEX `fk_mixer_concretera_idx` (`id_concretera` ASC),
  INDEX `fk_mixer_muestra_idx` (`id_muestra` ASC),
  CONSTRAINT `fk_mixer_proyecto`
    FOREIGN KEY (`id_proyecto_cc`)
    REFERENCES `fact_proyecto_cc` (`id_proyecto_cc`),
  CONSTRAINT `fk_mixer_concretera`
    FOREIGN KEY (`id_concretera`)
    REFERENCES `dim_concretera_cc` (`id_concretera`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- -----------------------------------------------------
-- fact_remision_cc (Lab submission shipments)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fact_remision_cc` (
  `id_remision` INT NOT NULL AUTO_INCREMENT,
  `id_proyecto_cc` INT NOT NULL,
  `consecutivo` INT NOT NULL COMMENT 'Auto-numbered per project',
  `fecha_creacion` DATE NOT NULL,
  `fecha_envio` DATE NULL,
  `procesado` BIT NOT NULL DEFAULT 0 COMMENT '0=open, 1=processed',
  `observaciones` VARCHAR(500) NULL,
  `created_on` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` VARCHAR(200) NOT NULL,
  `updated_on` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` VARCHAR(200) NULL,
  `is_active` BIT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_remision`),
  INDEX `fk_remision_proyecto_idx` (`id_proyecto_cc` ASC),
  UNIQUE INDEX `uq_remision_consecutivo` (`id_proyecto_cc` ASC, `consecutivo` ASC),
  CONSTRAINT `fk_remision_proyecto`
    FOREIGN KEY (`id_proyecto_cc`)
    REFERENCES `fact_proyecto_cc` (`id_proyecto_cc`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- -----------------------------------------------------
-- fact_muestra_cc
-- Based on legacy: fact_muestra
-- -----------------------------------------------------
DROP TABLE IF EXISTS `fact_muestra_cc`;
CREATE TABLE IF NOT EXISTS `fact_muestra_cc` (
  `id_muestra` INT NOT NULL AUTO_INCREMENT,
  `id_formato_mixer` INT NULL COMMENT 'FK al formato mixer de origen',
  `id_proyecto_cc` INT NOT NULL,
  `id_tipo_muestra` INT NOT NULL,
  `id_ubicacion` INT NULL,
  `id_piso` INT NULL,
  `id_estado` INT NOT NULL DEFAULT 1,
  `id_remision` INT NULL COMMENT 'NULL hasta asignar a remision',
  `id_concretera` INT NULL COMMENT 'Heredado del mixer o manual',
  `numero_muestra_obra` INT NULL COMMENT 'Numero consecutivo en obra',
  `fecha` DATE NOT NULL,
  `dia_recoleccion` SMALLINT NULL COMMENT '1=Lun, 2=Mar, 3=Mie, 4=Jue, 5=Vie, 6=Sab, 7=Dom',
  `localizacion` VARCHAR(120) NULL COMMENT 'Elemento - Piso - Detalle - Ejes',
  `observaciones` TEXT NULL,
  `archivo_1` VARCHAR(120) NULL,
  `archivo_2` VARCHAR(120) NULL,
  `created_on` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` VARCHAR(200) NOT NULL,
  `updated_on` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` VARCHAR(200) NULL,
  `is_active` BIT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_muestra`),
  INDEX `fk_muestra_proyecto_idx` (`id_proyecto_cc` ASC),
  INDEX `fk_muestra_tipo_idx` (`id_tipo_muestra` ASC),
  INDEX `fk_muestra_ubicacion_idx` (`id_ubicacion` ASC),
  INDEX `fk_muestra_piso_idx` (`id_piso` ASC),
  INDEX `fk_muestra_estado_idx` (`id_estado` ASC),
  INDEX `fk_muestra_remision_idx` (`id_remision` ASC),
  INDEX `fk_muestra_mixer_idx` (`id_formato_mixer` ASC),
  INDEX `fk_muestra_concretera_idx` (`id_concretera` ASC),
  CONSTRAINT `fk_muestra_proyecto`
    FOREIGN KEY (`id_proyecto_cc`)
    REFERENCES `fact_proyecto_cc` (`id_proyecto_cc`),
  CONSTRAINT `fk_muestra_tipo`
    FOREIGN KEY (`id_tipo_muestra`)
    REFERENCES `dim_tipo_muestra_cc` (`id_tipo_muestra`),
  CONSTRAINT `fk_muestra_ubicacion`
    FOREIGN KEY (`id_ubicacion`)
    REFERENCES `fact_ubicacion_cc` (`id_ubicacion`),
  CONSTRAINT `fk_muestra_piso`
    FOREIGN KEY (`id_piso`)
    REFERENCES `fact_piso_cc` (`id_piso`),
  CONSTRAINT `fk_muestra_estado`
    FOREIGN KEY (`id_estado`)
    REFERENCES `dim_estado_cc` (`id_estado_cc`),
  CONSTRAINT `fk_muestra_remision`
    FOREIGN KEY (`id_remision`)
    REFERENCES `fact_remision_cc` (`id_remision`),
  CONSTRAINT `fk_muestra_formato_mixer`
    FOREIGN KEY (`id_formato_mixer`)
    REFERENCES `fact_formato_mixer_cc` (`id_formato_mixer`),
  CONSTRAINT `fk_muestra_concretera`
    FOREIGN KEY (`id_concretera`)
    REFERENCES `dim_concretera_cc` (`id_concretera`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- Add FK from mixer to muestra (deferred because of circular reference)
ALTER TABLE `fact_formato_mixer_cc`
  ADD CONSTRAINT `fk_mixer_muestra`
    FOREIGN KEY (`id_muestra`)
    REFERENCES `fact_muestra_cc` (`id_muestra`);

-- -----------------------------------------------------
-- fact_datos_muestra_cc (Test results per sample per age)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `fact_datos_muestra_cc` (
  `id_dato_muestra` INT NOT NULL AUTO_INCREMENT,
  `id_muestra` INT NOT NULL,
  `id_edad_muestra` INT NOT NULL,
  `fecha_rotura` DATE NULL COMMENT 'Date tested',
  `resultado` DECIMAL(15,3) NULL COMMENT 'Test result (strength)',
  `porcentaje` DECIMAL(10,3) NULL COMMENT 'Percentage vs design',
  `id_observacion` INT NULL,
  `created_on` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` VARCHAR(200) NOT NULL,
  `updated_on` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` VARCHAR(200) NULL,
  `is_active` BIT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_dato_muestra`),
  UNIQUE INDEX `uq_dato_muestra_edad` (`id_muestra` ASC, `id_edad_muestra` ASC),
  INDEX `fk_dato_muestra_idx` (`id_muestra` ASC),
  CONSTRAINT `fk_dato_muestra`
    FOREIGN KEY (`id_muestra`)
    REFERENCES `fact_muestra_cc` (`id_muestra`),
  CONSTRAINT `fk_dato_edad`
    FOREIGN KEY (`id_edad_muestra`)
    REFERENCES `dim_edad_muestra_cc` (`id_edad_muestra`),
  CONSTRAINT `fk_dato_observacion`
    FOREIGN KEY (`id_observacion`)
    REFERENCES `fact_observacion_cc` (`id_observacion`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- -----------------------------------------------------
-- Seed dim_estado_cc
-- -----------------------------------------------------
INSERT IGNORE INTO `dim_estado_cc` (`descripcion`) VALUES
  ('En Proceso'),
  ('En Remisión'),
  ('Entregada'),
  ('Con Resultados'),
  ('Cerrada');
