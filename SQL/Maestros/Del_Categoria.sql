-- =============================================
-- Proceso: Maestros/Del_Categoria
-- =============================================
--START_PARAM
set @id_categoria = NULL
--END_PARAM

delete from dim_categoria_medio where id_categoria = @id_categoria;

select 'OK' as result;