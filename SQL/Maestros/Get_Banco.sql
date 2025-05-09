-- =============================================
-- Proceso: General/Get_Banco
-- =============================================
--START_PARAM
set @banco = ''

--END_PARAM

select id_banco from dim_banco_constructor where banco = @banco;