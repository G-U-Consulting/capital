-- =============================================
-- Proceso: ProcesoNegocio/Upd_LiberarUnidad
-- =============================================
--START_PARAM
set @id_negocios_unidades = 31;
--END_PARAM

update fact_negocios_unidades
set is_asignado = 0
where id_negocios_unidades = @id_negocios_unidades;

select u.nombre_unidad into @apto
from fact_negocios_unidades n
join fact_unidades u on n.id_unidad = u.id_unidad
where n.id_negocios_unidades = @id_negocios_unidades;

if @apto is not null then
    select concat('OK - ', coalesce(@apto, ''), ' liberado') as result;
else
    select concat('OK - no se encontró unidad') as result;
end if;