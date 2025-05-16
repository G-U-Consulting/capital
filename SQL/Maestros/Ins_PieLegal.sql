-- =============================================
-- Proceso: General/Ins_PieLegal
-- =============================================
--START_PARAM
set @pie_legal = NULL,
    @texto = '',
    @notas_extra = ''

--END_PARAM

IF NOT EXISTS (SELECT 1 FROM dim_pie_legal WHERE pie_legal = @pie_legal) THEN
    INSERT INTO dim_pie_legal (pie_legal, texto, notas_extra) VALUES (@pie_legal, @texto, @notas_extra);
    SELECT concat('OK-id_pie_legal:', last_insert_id()) AS result;
ELSE
    SELECT 'El pie legal ya existe' AS result;
END IF;