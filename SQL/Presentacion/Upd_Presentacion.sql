-- =============================================
-- Proceso: Presentacion/Upd_Presentacion
-- =============================================
--START_PARAM
set @duracion = "3";

--END_PARAM

update dim_variables_globales 
set valor = @duracion
where nombre_variable = 'CarDurac';

select 'OK' as result;
