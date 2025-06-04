-- =============================================
-- Proceso: General/Upd_Fiduciaria
-- =============================================
--START_PARAM
set
    @id_fiduciaria = '',
    @fiduciaria = '',
    @is_active = '0'
--END_PARAM

UPDATE dim_fiduciaria
    SET fiduciaria = @fiduciaria,
        is_active = if(@is_active = '0', 0, 1)
    WHERE id_fiduciaria = @id_fiduciaria;

select 'OK' as result;