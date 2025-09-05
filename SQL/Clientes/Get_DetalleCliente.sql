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