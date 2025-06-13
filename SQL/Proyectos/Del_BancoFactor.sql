-- =============================================
-- Proceso: Proyectos/Del_BancoFactor
-- =============================================
--START_PARAM
set @id_banco = NULL,
    @id_proyecto = NULL;
--END_PARAM

delete from dim_banco_factor where id_banco = @id_banco and id_proyecto = @id_proyecto;

select 'OK' as result;