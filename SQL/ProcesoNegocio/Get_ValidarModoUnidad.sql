-- =============================================
-- Proceso: ProcesoNegocio/Get_ValidarModoUnidad
-- =============================================
--START_PARAM
set @id_negocios_unidades = 1;
--END_PARAM

select
    case
        when count(distinct u.id_unidad) > 1 then 2
        when exists (
            select 1
            from fact_negocios_unidades nu2
            where nu2.id_cotizacion = nu.id_cotizacion
            and nu2.id_negocios_unidades != @id_negocios_unidades
            and nu2.is_asignado = 1
        ) then 2
        else 1
    end as modo
from fact_negocios_unidades nu
left join fact_unidades u on nu.id_unidad = u.id_unidad
where nu.id_negocios_unidades = @id_negocios_unidades
group by nu.id_cotizacion;
