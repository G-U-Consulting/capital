-- =============================================
-- Proceso: Maestros/Get_Salas 
-- =============================================
--START_PARAM
set @id_sala_venta = NULL;
--END_PARAM

select id_tipo_turno, id_sala_venta from dim_tipo_turno_sala where id_sala_venta = @id_sala_venta;

select id_campo, id_sala_venta from dim_campo_obligatorio_sala where id_sala_venta = @id_sala_venta;