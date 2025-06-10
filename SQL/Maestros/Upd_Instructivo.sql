-- =============================================
-- Proceso: General/Upd_instructivo
-- =============================================
--START_PARAM
set
    @id_instructivo = '',
    @instructivo = '',
    @procedimiento = '',
    @documentacion_cierre = '',
    @notas = '',
    @is_active = '0'
--END_PARAM

UPDATE dim_instructivo
    SET instructivo = @instructivo,
        procedimiento = @procedimiento,
        documentacion_cierre = @documentacion_cierre,
        notas = @notas,
        is_active = if(@is_active = '0', 0, 1)
    WHERE id_instructivo = @id_instructivo;

select 'OK' as result;