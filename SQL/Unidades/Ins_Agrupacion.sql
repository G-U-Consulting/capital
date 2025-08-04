-- =============================================
-- Proceso: Unidades/Ins_Agrupacion
-- =============================================
--START_PARAM
set @id_proyecto = NULL,
    @descripcion = NULL,
    @nombre = NULL;
--END_PARAM

insert into dim_agrupacion_unidad(id_proyecto, nombre, descripcion) values(@id_proyecto, @nombre, @descripcion);
select concat('OK-id_agrupacion:', (select id_agrupacion from dim_agrupacion_unidad 
    where id_proyecto = @id_proyecto and nombre = @nombre)) as result;