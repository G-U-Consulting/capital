-- =============================================
-- Proceso: General/Upd_banco_factor
-- =============================================
--START_PARAM
set @id_banco = '',
    @id_factor = '',
    @valor = '0'
--END_PARAM

UPDATE dim_banco_factor
    SET valor = @valor
    WHERE id_banco = @id_banco and id_factor = @id_factor;

select 'OK' as result;