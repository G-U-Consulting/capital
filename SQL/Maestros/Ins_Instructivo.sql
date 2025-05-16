-- =============================================
-- Proceso: General/Ins_instructivo
-- =============================================
--START_PARAM
set @instructivo = NULL,
    @procedimiento = '',
    @documentacion_cierre = '',
    @notas = ''

--END_PARAM

INSERT INTO dim_instructivo (instructivo, procedimiento, documentacion_cierre, notas) 
    VALUES (@instructivo, @procedimiento, @documentacion_cierre, @notas);
SELECT concat('OK-id_instructivo:', (SELECT id_instructivo from dim_instructivo where instructivo = @instructivo)) AS result;