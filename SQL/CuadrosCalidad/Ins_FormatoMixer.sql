--START_PARAM
set @id_proyecto_cc = NULL,
    @id_concretera = NULL,
    @fecha = NULL,
    @cantidad_m3 = NULL,
    @resistencia_psi = NULL,
    @asentamiento_esperado = NULL,
    @asentamiento_real = NULL,
    @temperatura = NULL,
    @recibido = 0,
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

-- Only insert if no validation error
INSERT INTO fact_formato_mixer_cc (
    id_proyecto_cc, id_concretera, fecha, cantidad_m3,
    resistencia_psi, resistencia_mpa,
    asentamiento_esperado, asentamiento_real, temperatura,
    recibido, numero_remision,
    observaciones,
    created_by, is_active
)
SELECT
    @id_proyecto_cc, @id_concretera, @fecha, @cantidad_m3,
    @resistencia_psi, @_mpa,
    @asentamiento_esperado, @asentamiento_real, @temperatura,
    @recibido, @numero_remision,
    @observaciones,
    @usuario, 1
FROM dual WHERE @_err IS NULL;

SELECT COALESCE(@_err, LAST_INSERT_ID()) AS resultado;
