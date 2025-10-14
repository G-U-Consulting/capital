-- =============================================
-- Proceso: Gestion/Get_Listas
-- =============================================
--START_PARAM
set @id_unidad = 75903;
--END_PARAM

select l.id_lista, l.lista, precio
from dim_lista_precios l
join dim_precio_unidad p on l.id_lista = p.id_lista
where p.id_unidad = @id_unidad
order by cast(l.lista as unsigned);
