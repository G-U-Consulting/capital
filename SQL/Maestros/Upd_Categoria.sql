-- =============================================
-- Proceso: General/Upd_categoria
-- =============================================
--START_PARAM
set
    @id_categoria = '',
    @categoria = '',
    @is_active = '0'
--END_PARAM

UPDATE dim_categoria_medio
    SET categoria = @categoria,
        is_active = if(@is_active = '0', 0, 1)
    WHERE id_categoria = @id_categoria;

select 'OK' as result;