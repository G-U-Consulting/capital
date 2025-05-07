-- =============================================
-- Proceso: General/Upd_medio
-- =============================================
--START_PARAM
set
    @id_medio = '',
    @medio = '',
    @is_active = 1,
    @id_categoria = '',
    @id_sinco
--END_PARAM

UPDATE dim_medio_publicitario
    SET medio = @medio,
    is_active = @is_active,
    id_categoria = @id_categoria,
    id_sinco = @id_sinco
    WHERE id_medio = @id_medio;

select 'OK' as result;