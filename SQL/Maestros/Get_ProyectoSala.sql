-- =============================================
-- Proceso: Maestros/Get_ProyectoSala
-- =============================================
--START_PARAM
set @id_sala = NULL;

--END_PARAM

select id_proyecto, nombre, is_active, id_sede, id_zona_proyecto, id_ciudadela
from fact_proyectos
where id_proyecto not in (select id_proyecto from dim_sala_proyecto where id_sala_venta = @id_sala)
order by is_active desc, nombre;

select sp.id_proyecto, sp.id_sala_venta, sp.descuento, sp.opcionar, sp.visualizar, date_format(sp.vigencia,'%Y-%m-%d') as vigencia,
date_format(sp.fecha_asignacion,'%Y-%m-%d') as fecha_asignacion, p.nombre, p.is_active
from dim_sala_proyecto sp join fact_proyectos p
on sp.id_proyecto = p.id_proyecto
where sp.id_sala_venta = @id_sala
order by p.is_active desc, p.nombre;