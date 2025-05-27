-- =============================================
-- Proceso: Medios/Get_GrupoProyecto
-- =============================================
--START_PARAM
set @id_proyecto = '';

--END_PARAM

select * from dim_grupo_proyecto where id_proyecto = @id_proyecto;