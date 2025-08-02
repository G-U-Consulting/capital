-- =============================================
-- Proceso: Unidades/Get_Agrupacion
-- =============================================
--START_PARAM
set @id_proyecto = NULL;

--END_PARAM

select * from dim_agrupacion_unidad where id_proyecto = @id_proyecto;