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