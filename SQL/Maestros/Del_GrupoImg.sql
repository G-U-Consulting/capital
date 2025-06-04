-- =============================================
-- Proceso: Maestros/Del_GrupoImg
-- =============================================
--START_PARAM
set @id_grupo_img = NULL
--END_PARAM

delete from dim_grupo_img where id_grupo_img = @id_grupo_img;

select 'OK' as result;