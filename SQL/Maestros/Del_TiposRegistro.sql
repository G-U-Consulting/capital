-- =============================================
-- Proceso: Maestros/Del_TiposTramite
-- =============================================
--START_PARAM
set @id_tipo_registro = NULL
--END_PARAM

delete from dim_tipo_registro where id_tipo_registro = @id_tipo_registro;

select 'OK' as result;