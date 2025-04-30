-- =============================================
-- Proceso: General/Upd_PieLegal
-- =============================================
--START_PARAM
set
    @id_pie_legal = '',
    @pie_legal = ''
--END_PARAM

IF NOT EXISTS (SELECT 1 FROM dim_pie_legal WHERE pie_legal = @pie_legal) THEN
    UPDATE dim_pie_legal
    SET pie_legal = @pie_legal
    WHERE id_pie_legal = @id_pie_legal;
ELSE
    SELECT 'El pie legal ya existe' AS result;
END IF;

select 'OK' as result;