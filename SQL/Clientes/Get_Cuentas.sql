-- =============================================
-- Proceso: Clientes/Get_Cuentas
-- =============================================
--START_PARAM
set @id_desistimiento = NULL;
--END_PARAM

select * from dim_cuenta_desistimiento;