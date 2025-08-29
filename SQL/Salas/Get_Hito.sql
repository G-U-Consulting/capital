-- =============================================
-- Proceso: Salas/Get_Hito
-- =============================================
--START_PARAM
set @id_sala_venta = NULL;
--END_PARAM

select h.id_hito, h.titulo, h.descripcion, date_format(h.fecha, '%Y-%m-%d %T') as fecha, 
    h.color, h.festivo, h.id_sala_venta, h.id_proyecto, h.id_torre, h.id_unidad, h.frecuencia, date_format(h.limite, '%Y-%m-%d') as limite,
    (select sv.sala_venta from dim_sala_venta sv where h.id_sala_venta is not null and sv.id_sala_venta = h.id_sala_venta) as sala_venta,
    (select p.nombre from fact_proyectos p where h.id_proyecto is not null and p.id_proyecto = h.id_proyecto) as nombre_pro,
    (select concat('Torre ', t.consecutivo) from fact_torres t where h.id_torre is not null and t.id_torre = h.id_torre) as torre,
    (select concat(un.clase, ' ', un.numero_apartamento) from fact_unidades un where h.id_unidad is not null and un.id_unidad = h.id_unidad) as unidad,
    group_concat(c.cargo order by c.cargo separator ',') as categorias
from dim_hito_sala h
left join dim_hito_cargo hc on hc.id_hito = h.id_hito
left join dim_cargo c on c.id_cargo = hc.id_cargo
where h.id_sala_venta = @id_sala_venta
group by h.id_hito
order by fecha;