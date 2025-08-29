-- =============================================
-- Proceso: ProcesoNegocio/Del_Item
-- =============================================
--START_PARAM
set @id_negocios_unidades = 0;
--END_PARAM


delete
from fact_negocios_unidades
where id_negocios_unidades = @id_negocios_unidades;

select 'OK' as result;