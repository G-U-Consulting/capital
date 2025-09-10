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

select l.*, c.numero_documento, p.nombre as proyecto from fact_lista_espera l
join fact_clientes c on l.id_cliente = c.id_cliente
join fact_proyectos p on l.id_proyecto = p.id_proyecto
where l.id_cliente = @id_cliente and l.is_active = 1
order by l.created_on;