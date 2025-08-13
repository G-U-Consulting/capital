-- =============================================
-- Proceso: Unidades/Get_ListasPrecios
-- =============================================
--START_PARAM
set @id_proyecto = NULL;

--END_PARAM

select date_format(l.updated_on, '%d/%m/%Y %T') as updated_on, l.* from dim_lista_precios l where l.id_proyecto = @id_proyecto;
