-- =============================================
-- Proceso: Clientes/Get_Desistimientos
-- =============================================
--START_PARAM

--END_PARAM

select d.*, v.radicado, p.id_proyecto, p.nombre as proyecto, t.id_torre, t.consecutivo as torre,
    coalesce(a.nombre, u.numero_apartamento) as unidad, e.id_estado, e.nombre as estado,
    c.numero_documento, c.nombres, c.apellido1, c.apellido2
from dim_desistimiento d
join dim_estado_desistimiento e on d.id_estado = e.id_estado
join fact_ventas v on d.id_venta = v.id_venta
join fact_clientes c on v.id_cliente = c.id_cliente
join fact_unidades u on v.id_unidad = u.id_unidad
join fact_torres t on u.id_torre = t.id_torre
join fact_proyectos p on u.id_proyecto = p.id_proyecto
join dim_agrupacion_unidad a on u.id_agrupacion = a.id_agrupacion
order by ultima_fecha;

select id_categoria, categoria
from dim_categoria_desistimiento;

select id_penalidad, penalidad, campo
from dim_penalidad_desistimiento;

select id_fiduciaria, fiduciaria
from dim_fiduciaria
where is_active = 1;

select v.id_venta, v.radicado, p.id_proyecto, p.nombre as proyecto, t.id_torre, t.consecutivo as torre, 
    d.id_desistimiento, e.nombre as estado, coalesce(a.nombre, u.numero_apartamento) as unidad, us.nombres as asesor,
    c.id_cliente, c.numero_documento, c.nombres, c.apellido1, c.apellido2, date_format(v.created_on, '%d/%m/%Y') as created_on
from fact_ventas v
join fact_clientes c on v.id_cliente = c.id_cliente
join fact_unidades u on v.id_unidad = u.id_unidad
join fact_torres t on u.id_torre = t.id_torre
join fact_proyectos p on u.id_proyecto = p.id_proyecto
join dim_agrupacion_unidad a on u.id_agrupacion = a.id_agrupacion
join fact_usuarios us on v.created_by = us.usuario collate utf8mb4_general_ci
left join dim_desistimiento d on v.id_venta = d.id_venta
left join dim_estado_desistimiento e on d.id_estado = e.id_estado;