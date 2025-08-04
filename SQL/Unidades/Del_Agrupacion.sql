-- =============================================
-- Proceso: Unidades/Del_Agrupacion
-- =============================================
--START_PARAM
set @id_agrupacion = NULL;

--END_PARAM

start transaction;
update fact_unidades set id_agrupacion = NULL where id_agrupacion = @id_agrupacion;
delete from dim_agrupacion_unidad where id_agrupacion = @id_agrupacion;
commit;

select 'OK' as result;