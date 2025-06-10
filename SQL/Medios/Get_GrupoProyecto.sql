-- =============================================
-- Proceso: Medios/Get_GrupoProyecto
-- =============================================
--START_PARAM
set @id_proyecto = '1';

--END_PARAM

select * from dim_grupo_proyecto where id_proyecto = @id_proyecto
order by orden, grupo, modulo;