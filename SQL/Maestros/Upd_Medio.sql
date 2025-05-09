-- =============================================
-- Proceso: General/Upd_medio
-- =============================================
--START_PARAM
set
    @id_medio = '1',
    @medio = 'Ad@ CAPITAL',
    @is_active = 0,
    @id_categoria = '1',
    @id_sinco = '0'

--END_PARAM

UPDATE dim_medio_publicitario
    SET medio = @medio,
    is_active = @is_active,
    id_categoria = @id_categoria,
    id_sinco = @id_sinco
    WHERE id_medio = @id_medio;

select 'OK' as result;