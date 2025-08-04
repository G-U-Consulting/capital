-- =============================================
-- Proceso: Unidades/Upd_Agrupacion
-- =============================================
--START_PARAM
set @id_agrupacion = NULL,
    @descripcion = NULL,
    @nombre = NULL;
--END_PARAM

update dim_agrupacion_unidad
set nombre = @nombre,
    descripcion = @descripcion
where id_agrupacion = @id_agrupacion;

select 'OK' as result;