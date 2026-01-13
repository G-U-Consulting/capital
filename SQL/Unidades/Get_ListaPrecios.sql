-- =============================================
-- Proceso: Unidades/Get_ListaPrecios
-- =============================================
--START_PARAM
set @id_proyecto = '9';

--END_PARAM

select date_format(l.updated_on, '%d/%m/%Y') as updated_on, l.*, cast((
        (select sum(pu.precio) from dim_precio_unidad pu where pu.id_lista = l.id_lista) / 
        (select sum(u.area_total) from fact_unidades u where u.id_proyecto = @id_proyecto)
    ) as decimal(20,2)) as promedio_m2
from dim_lista_precios l 
where l.id_proyecto = @id_proyecto;

select ltt.id_tipo, tu.tipo, ltt.id_torre, ft.consecutivo, ltt.id_lista, lp.lista
from dim_props_tipo_torre ltt 
join dim_tipo_unidad tu on ltt.id_tipo = tu.id_tipo
join fact_torres ft on ltt.id_torre = ft.id_torre
left join dim_lista_precios lp on ltt.id_lista = lp.id_lista
where tu.id_proyecto = @id_proyecto and ft.id_proyecto = @id_proyecto and tu.tipo != '';