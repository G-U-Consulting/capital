-- =============================================
-- Proceso: General/Ins_PieLegal
-- =============================================
--START_PARAM
set @pie_legal = ''

--END_PARAM

IF NOT EXISTS (SELECT 1 FROM dim_pie_legal WHERE pie_legal = @pie_legal) THEN
    INSERT INTO dim_pie_legal (pie_legal) VALUES (@pie_legal);
    SELECT concat('OK-id_pie_legal:', (SELECT id_pie_legal from dim_pie_legal where pie_legal = @pie_legal)) AS result;
ELSE
    SELECT 'El pie legal ya existe' AS result;
END IF;