-- =============================================
-- Proceso: Usuarios/Upd_Seguridad
-- =============================================
--START_PARAM
set @valor = {};

--END_PARAM

update dim_variables_globales 
set valor = @valor
where nombre_variable = 'js_seguridad';

select 'OK' as result;
