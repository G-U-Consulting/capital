-- =============================================
-- Proceso: Proyecto/Get_Salas 
-- =============================================
--START_PARAM
set @id_sala = NULL;
--END_PARAM

select id_sala_venta, sala_venta, encuesta_vpn, id_sede, id_playlist
from dim_sala_venta 
where is_active = 1;

select id_proyecto, nombre, id_sala_venta, date_format(fecha_asignacion_sala, '%Y-%m-%d %T') as fecha_asignacion_sala
from fact_proyectos 
where id_sala_venta = @id_sala;

select id_tipo_turno, tipo_turno from dim_tipo_turno order by id_tipo_turno;

select id_tipo_turno, id_sala_venta from dim_tipo_turno_sala where id_sala_venta = @id_sala;

select id_campo, campo from dim_campo_obligatorio order by id_campo;

select id_campo, id_sala_venta from dim_campo_obligatorio_sala where id_sala_venta = @id_sala;