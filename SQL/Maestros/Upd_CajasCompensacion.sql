-- =============================================
-- Proceso: General/Upd_CajasCompensacion
-- =============================================
--START_PARAM
set
    @id_caja = NULL,
    @caja = NULL,
    @is_active = '0'
--END_PARAM

UPDATE dim_caja_compensacion
    SET caja = @caja,
        is_active = if(@is_active = '0', 0, 1)
    WHERE id_caja = @id_caja;

select 'OK' as result;