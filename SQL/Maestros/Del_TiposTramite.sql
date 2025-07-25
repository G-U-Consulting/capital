-- =============================================
-- Proceso: Maestros/Del_TiposTramite
-- =============================================
--START_PARAM
set @id_tipo_tramite = NULL
--END_PARAM

delete from dim_tipo_tramite where id_tipo_tramite = @id_tipo_tramite;

select 'OK' as result;