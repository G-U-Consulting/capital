-- =============================================
-- Proceso: General/Upd_BancoFactor
-- =============================================
--START_PARAM
set @id_banco = NULL,
    @id_factor = NULL,
    @id_tipo_factor = NULL,
    @valor = '0',
    @id_proyecto = NULL;
--END_PARAM

UPDATE dim_banco_factor
    SET valor = @valor
    WHERE id_banco = @id_banco and id_factor = @id_factor and id_tipo_factor = @id_tipo_factor 
        and (id_proyecto = @id_proyecto or (id_proyecto is NULL and @id_proyecto is null));

select 'OK' as result;