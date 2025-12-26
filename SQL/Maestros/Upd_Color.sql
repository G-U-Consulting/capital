-- =============================================
-- Proceso: Maestros/Upd_Color
-- =============================================
--START_PARAM
set @id_estado_unidad = NULL,
    @estado_unidad = NULL,
    @estado_unidad_plural = NULL,
    @color_fondo = NULL,
    @color_fuente = NULL,
    @is_active = NULL,
    @is_virtual = NULL;
--END_PARAM

update dim_estado_unidad
set estado_unidad = @estado_unidad,
    estado_unidad_plural = @estado_unidad_plural,
    color_fondo = @color_fondo,
    color_fuente = @color_fuente,
    is_active = if(@is_active = '1', 1, 0),
    is_virtual = if(@is_virtual = '1', 1, 0)
where id_estado_unidad = @id_estado_unidad;

select 'OK' as result;