-- =============================================
-- Proceso: General/Upd_Banco
-- =============================================
--START_PARAM
set
    @id_banco = '',
    @banco = '',
    @is_active = '0'
--END_PARAM

UPDATE dim_banco_constructor
    SET banco = @banco,
        is_active = if(@is_active = '0', 0, 1)
    WHERE id_banco = @id_banco;

select 'OK' as result;