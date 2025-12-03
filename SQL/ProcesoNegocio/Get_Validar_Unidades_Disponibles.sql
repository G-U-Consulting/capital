-- =============================================
-- Proceso: ProcesoNegocio/Get_Validar_Unidades_Disponibles
-- =============================================
--START_PARAM
set @id_cotizacion = '1';
--END_PARAM

select
    u.id_unidad,
    u.nombre_unidad as unidad,
    u.id_estado_unidad,
    e.estado_unidad as nombre_estado,
    case
        when u.id_estado_unidad = 1 then 1 
        else 0 
    end as disponible
from fact_unidades u
inner join fact_negocios_unidades n on u.id_unidad = n.id_unidad
inner join dim_estado_unidad e on u.id_estado_unidad = e.id_estado_unidad
where n.id_cotizacion = @id_cotizacion
order by u.nombre_unidad;
