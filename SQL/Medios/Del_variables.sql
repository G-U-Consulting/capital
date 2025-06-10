-- =============================================
-- Proceso: Medios/Del_variables
-- =============================================
--START_PARAM
set @id_proyecto = 0,
    @modulo = '';
--END_PARAM

delete from dim_grupo_proyecto where id_proyecto = @id_proyecto and modulo = @modulo;

select 'OK'