-- =============================================
-- Proceso: ProcesoNegocio/Get_InfoLista
-- =============================================
--START_PARAM

set @usuario = 'prueba',
    @id_cliente = 2,
    @id_unidad = 175378;
--END_PARAM

select us.nombres as nombre_asesor,
   concat(coalesce(c.nombres, ''), ' ', coalesce(c.apellido1, ''), ' ', coalesce(c.apellido2, '')) as nombre_cliente,
   u.nombre_unidad, tp.tipo_proyecto as clase, tu.tipo, t.consecutivo as torre, coalesce(c.email1, c.email2) as email
from fact_usuarios us
left join fact_clientes c on c.id_cliente = @id_cliente
left join fact_unidades u on u.id_unidad = @id_unidad
left join dim_tipo_proyecto tp on u.id_clase = tp.id_tipo_proyecto
left join dim_tipo_unidad tu on u.id_tipo = tu.id_tipo
left join fact_torres t on u.id_torre = t.id_torre
where us.usuario = @usuario 
limit 1;