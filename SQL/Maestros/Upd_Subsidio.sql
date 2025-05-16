-- =============================================
-- Proceso: General/Upd_tramite
-- =============================================
--START_PARAM
set @id_subsidio = '',
    @smmlv = '0',
    @smmlv_0_2 = '0',
    @smmlv_2_4 = '0',
    @imagen = '',
    @periodo = NULL
--END_PARAM

UPDATE dim_subsidio_vis
    SET periodo = @periodo,
    smmlv = @smmlv,
    smmlv_0_2 = @smmlv_0_2,
    smmlv_2_4 = @smmlv_2_4,
    imagen = @imagen
    WHERE id_subsidio = @id_subsidio;

select 'OK' as result;