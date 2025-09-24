-- =============================================
-- Proceso: Clientes/Get_Desistimientos
-- =============================================
--START_PARAM

--END_PARAM

select date_format(d.ultima_fecha, '%Y-%m-%d %T') as ultima_fecha, 
    date_format(d.created_on, '%Y-%m-%d %T') as created_on, 
    date_format(d.fecha_resolucion, '%Y-%m-%d') as fecha_resolucion, 
    date_format(d.fecha_fpc, '%Y-%m-%d') as fecha_fpc,
    date_format(d.fecha_program, '%Y-%m-%d') as fecha_program,
    date_format(d.fec_com_coordinacion, '%Y-%m-%d') as fec_com_coordinacion,
    date_format(d.fec_com_direccion, '%Y-%m-%d') as fec_com_direccion,
    date_format(d.fec_prorroga_carta, '%Y-%m-%d') as fec_prorroga_carta,
    d.*, p.id_proyecto, p.nombre as proyecto, t.id_torre, t.consecutivo as torre,
    d.pnl_monto as `Monto`,
    coalesce(a.nombre, u.numero_apartamento) as unidad, e.id_estado, e.nombre as estado,
    concat(coalesce(c.nombres, ''), ' ', coalesce(c.apellido1, ''), ' ', coalesce(c.apellido2, '')) as nombre_cliente,
    c.numero_documento, c.nombres, c.apellido1, c.apellido2, c.id_cliente, us.nombres as asesor
from dim_desistimiento d
join dim_estado_desistimiento e on d.id_estado = e.id_estado
join fact_ventas v on d.id_venta = v.id_venta
join fact_clientes c on v.id_cliente = c.id_cliente
join fact_unidades u on v.id_unidad = u.id_unidad
join fact_torres t on u.id_torre = t.id_torre
join fact_proyectos p on u.id_proyecto = p.id_proyecto
join dim_agrupacion_unidad a on u.id_agrupacion = a.id_agrupacion
join fact_usuarios us on d.created_by = us.usuario collate utf8mb4_general_ci
order by ultima_fecha;

select id_categoria, categoria
from dim_categoria_desistimiento;

select id_penalidad, penalidad, campo
from dim_penalidad_desistimiento;

select id_fiduciaria, fiduciaria
from dim_fiduciaria
where is_active = 1;

select v.id_venta, d.radicado, p.id_proyecto, p.nombre as proyecto, t.id_torre, t.consecutivo as torre, 
    d.id_desistimiento, e.nombre as estado, coalesce(a.nombre, u.nombre_unidad) as unidad, us.nombres as asesor,
    concat(coalesce(c.nombres, ''), ' ', coalesce(c.apellido1, ''), ' ', coalesce(c.apellido2, '')) as nombre_cliente,
    c.id_cliente, c.numero_documento, c.nombres, c.apellido1, c.apellido2, date_format(v.created_on, '%Y-%m-%d %T') as created_on,
    coalesce(f1.id_fiduciaria, f2.id_fiduciaria) as id_fiduciaria
from fact_ventas v
join fact_clientes c on v.id_cliente = c.id_cliente
join fact_unidades u on v.id_unidad = u.id_unidad
join fact_torres t on u.id_torre = t.id_torre
join fact_proyectos p on u.id_proyecto = p.id_proyecto
left join dim_agrupacion_unidad a on u.id_agrupacion = a.id_agrupacion
join fact_usuarios us on v.created_by = us.usuario collate utf8mb4_general_ci
left join dim_desistimiento d on v.id_venta = d.id_venta
left join dim_estado_desistimiento e on d.id_estado = e.id_estado
left join dim_fiduciaria f1 on t.id_fiduciaria = f1.id_fiduciaria
left join dim_fiduciaria f2 on p.id_fiduciaria = f2.id_fiduciaria;

select id_estado, nombre
from dim_estado_desistimiento
order by id_estado;

select id_proyecto, nombre
from fact_proyectos;