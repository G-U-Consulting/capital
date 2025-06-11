-- =============================================
-- Proceso: Maestros/Upd_Color
-- =============================================
--START_PARAM
set
    @id_color = NULL,
    @estado = NULL,
    @color = NULL,
    @is_active = '0'
--END_PARAM

UPDATE dim_color
    SET estado = @estado,
        color = @color,
        is_active = if(@is_active = '0', 0, 1)
    WHERE id_color = @id_color;

select 'OK' as result;