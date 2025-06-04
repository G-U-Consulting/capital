-- =============================================
-- Proceso: Maestros/Del_TipoVIS
-- =============================================
--START_PARAM
set @id_tipo_vis = NULL
--END_PARAM

delete from dim_tipo_vis where id_tipo_vis = @id_tipo_vis;

select 'OK' as result;