-- =============================================
-- Proceso: ProcesoNegocio/Get_CuponesAvisor
-- =============================================
--START_PARAM
set @id_opcion = 100;
--END_PARAM

select c.id_cupon, c.id_unidad, c.invoice, coalesce(a.nombre, u.nombre_unidad) as unidad,
	c.ticket_id_enviar, c.ticket_id_descargar, c.ecollect_url_enviar, c.ecollect_url_descargar
from dim_cupon_avisor c
join fact_unidades u on c.id_unidad = u.id_unidad
left join dim_agrupacion_unidad a on u.id_agrupacion = a.id_agrupacion
where id_opcion = @id_opcion;
