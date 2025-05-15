-- =============================================
-- Proceso: General/Upd_categoria
-- =============================================
--START_PARAM
set
    @id_categoria = '',
    @categoria = ''
--END_PARAM

UPDATE dim_categoria_medio
    SET categoria = @categoria
    WHERE id_categoria = @id_categoria;

select 'OK' as result;