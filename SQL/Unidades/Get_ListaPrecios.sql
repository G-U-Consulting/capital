-- =============================================
-- Proceso: Unidades/Get_ListaPrecios
-- =============================================
--START_PARAM
set @id_proyecto = NULL;

--END_PARAM

select date_format(l.updated_on, '%d/%m/%Y %T') as updated_on, l.*, cast((
        (select sum(pu.precio) from dim_precio_unidad pu where pu.id_lista = l.id_lista) / 
        (select sum(u.area_total) from fact_unidades u where u.id_proyecto = @id_proyecto)
    ) as decimal(20,2)) as promedio_m2
from dim_lista_precios l 
where l.id_proyecto = @id_proyecto;
