-- =============================================
-- Proceso: Unidades/Upd_Agrupacion
-- =============================================
--START_PARAM
set @id_agrupacion = NULL,
    @nombre = NULL;
--END_PARAM

update dim_agrupacion_unidad
set nombre = @nombre
where id_agrupacion = @id_agrupacion;

select 'OK' as result;