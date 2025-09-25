-- =============================================
-- Proceso: Clientes/Get_DetalleCliente
-- =============================================
--START_PARAM
set @id_cliente = NULL;
--END_PARAM

select id_visita, p.id_proyecto, p.nombre as proyecto, v.descripcion, mc.id_motivo_compra,
    mc.motivo_compra, date_format(v.created_on, '%Y/%m/%d') as fecha, mp.id_medio, mp.medio
from fact_visitas v
left join fact_proyectos p on v.id_proyecto = p.id_proyecto
left join dim_medio_publicitario mp on v.id_medio = mp.id_medio
left join dim_motivo_compra mc on v.id_motivo_compra = mc.id_motivo_compra
where id_cliente = @id_cliente
order by v.created_on desc;

select l.*, coalesce(c.email1, email2) as email, coalesce(c.telefono1, c.telefono2) as telefono, c.numero_documento,
    concat(coalesce(c.nombres, ''), ' ', coalesce(c.apellido1, ''), ' ', coalesce(c.apellido2, '')) as nombre_cliente,
    c.nombres, c.apellido1, c.apellido2, u.nombres as nombre_asesor, p.nombre as proyecto 
from fact_lista_espera l
join fact_clientes c on l.id_cliente = c.id_cliente
join fact_proyectos p on l.id_proyecto = p.id_proyecto
join fact_usuarios u on l.id_usuario = u.id_usuario
where l.id_cliente = @id_cliente and l.is_active = 1
order by created_on desc;

select v.id_venta, date_format(v.created_on, '%Y-%m-%d') as fecha,
    if(un.id_agrupacion is null,
        (select pu.precio from dim_precio_unidad pu
            where pu.id_lista = if(un.id_lista is null, 
            (select p.id_lista from fact_proyectos p where p.id_proyecto = un.id_proyecto), un.id_lista) and pu.id_unidad = un.id_unidad
        ),
        (select
            coalesce(sum(
            if(u.id_clase = 8, (select pu.precio from dim_precio_unidad pu
                where pu.id_lista = if(u.id_lista is null, 
                (select p.id_lista from fact_proyectos p where p.id_proyecto = u.id_proyecto), u.id_lista) and pu.id_unidad = u.id_unidad
            ), u.valor_complemento)), 0) as total
        from dim_agrupacion_unidad ag
        left join fact_unidades u on ag.id_agrupacion = u.id_agrupacion
        where ag.id_agrupacion = a.id_agrupacion
    )) as importe,
    coalesce(a.nombre, concat(coalesce(tp.tipo_proyecto, ''), ' ', un.numero_apartamento)) as unidad,
    us.nombres as asesor, t.consecutivo as torre, p.nombre as proyecto, sv.sala_venta
from fact_ventas v
join dim_venta_cliente vc on v.id_venta = vc.id_venta
join fact_unidades un on v.id_unidad = un.id_unidad
left join dim_agrupacion_unidad a on un.id_agrupacion = a.id_agrupacion
join dim_tipo_proyecto tp on un.id_clase = tp.id_tipo_proyecto
join fact_torres t on un.id_torre = t.id_torre
join fact_proyectos p on un.id_proyecto = p.id_proyecto
join dim_sala_venta sv on v.id_sala_venta = sv.id_sala_venta
join fact_usuarios us on v.created_by = us.usuario collate utf8mb4_general_ci
where vc.id_cliente = @id_cliente;