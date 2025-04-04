-- =============================================
-- Proceso: Usuarios/Del_Cargo
-- =============================================
--START_PARAM
set
    @id_cargo = '1'
--END_PARAM

delete a from dim_cargo a where id_cargo = @id_cargo;

select 'OK' as result;