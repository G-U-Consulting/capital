-- =============================================
-- Proceso: ProcesoNegocio/Ins_Avisor
-- =============================================
--START_PARAM
set @id_opcion = 100,
	@usuario = 'prueba';
--END_PARAM

insert ignore into dim_cupon_avisor(id_opcion, id_unidad, id_usuario, invoice)
select o.id_opcion, u.id_unidad, us.id_usuario,
	case 
        when coalesce(t.id_fiduciaria, p.id_fiduciaria) = 6
            then coalesce(u.encargo_fiduciario, u.pate)
        when p.centro_costos is not null and p.centro_costos <> ''
            then concat(lpad(floor(rand() * 100), 2, '0'), lpad(p.centro_costos, 4, '0'), lpad(t.consecutivo, 2, '0'), lpad(u.numero_apartamento, 4, '0'))
        else concat(substring(unix_timestamp(), 1, 6), lpad(t.consecutivo, 2, '0'), lpad(u.numero_apartamento, 4, '0'))
    end as invoice
from fact_opcion o
join fact_cotizaciones co on o.id_cotizacion = co.id_cotizacion
join fact_negocios_unidades n on n.id_cotizacion = co.id_cotizacion
join fact_clientes c on co.id_cliente = c.id_cliente
join fact_proyectos p on co.id_proyecto = p.id_proyecto
join fact_unidades u on n.id_unidad = u.id_unidad
join fact_torres t on u.id_torre = t.id_torre
join fact_usuarios us on @usuario = us.usuario collate utf8mb4_general_ci
where o.id_opcion = @id_opcion;

select concat('OK-ids_cupones:', 
	(select group_concat(id_cupon separator ',') 
		from dim_cupon_avisor 
		where id_opcion = @id_opcion 
		group by id_opcion
	)) 
as result;