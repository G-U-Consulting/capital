-- =============================================
-- Proceso: General/Upd_grupo_img
-- =============================================
--START_PARAM
set
    @id_grupo_img = '',
    @grupo = '',
    @orden = '0'
--END_PARAM

UPDATE dim_grupo_img
    SET grupo = @grupo,
    orden = @orden
    WHERE id_grupo_img = @id_grupo_img;

select 'OK' as result;