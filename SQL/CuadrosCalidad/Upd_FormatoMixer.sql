--START_PARAM
set @id_formato_mixer = NULL,
    @id_concretera = NULL,
    @fecha = NULL,
    @cantidad_m3 = NULL,
    @resistencia_psi = NULL,
    @asentamiento_esperado = NULL,
    @asentamiento_real = NULL,
    @temperatura = NULL,
    @recibido = NULL,
    @numero_remision = NULL,
    @observaciones = NULL,
    @usuario = NULL;
--END_PARAM

-- Validate required fields
SET @_err = CASE
    WHEN @fecha IS NULL OR @fecha = '' THEN 'ERROR:La fecha es obligatoria'
    WHEN @cantidad_m3 IS NULL OR @cantidad_m3 = '' THEN 'ERROR:La cantidad (m3) es obligatoria'
    WHEN @id_concretera IS NULL OR @id_concretera = '' THEN 'ERROR:Seleccione una concretera'
    WHEN @resistencia_psi IS NULL OR @resistencia_psi = '' THEN 'ERROR:La resistencia (PSI) es obligatoria'
    ELSE NULL
END;

-- Auto-calculate MPa from PSI
SET @_mpa = ROUND(@resistencia_psi * 0.00689476, 3);

-- Only update if no validation error
UPDATE fact_formato_mixer_cc
SET id_concretera = @id_concretera,
    fecha = @fecha,
    cantidad_m3 = @cantidad_m3,
    resistencia_psi = @resistencia_psi,
    resistencia_mpa = @_mpa,
    asentamiento_esperado = @asentamiento_esperado,
    asentamiento_real = @asentamiento_real,
    temperatura = @temperatura,
    recibido = @recibido,
    numero_remision = @numero_remision,
    observaciones = @observaciones,
    updated_by = @usuario
WHERE id_formato_mixer = @id_formato_mixer
  AND @_err IS NULL;

SELECT COALESCE(@_err, 'OK') AS resultado;
