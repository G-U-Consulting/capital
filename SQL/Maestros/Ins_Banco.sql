-- =============================================
-- Proceso: General/Ins_Banco
-- =============================================
--START_PARAM
set @banco = NULL;

--END_PARAM

insert into dim_banco_constructor (banco) values (@banco);

select CONCAT('OK-id_banco:', (select id_banco from dim_banco_constructor where banco=@banco)) as result;