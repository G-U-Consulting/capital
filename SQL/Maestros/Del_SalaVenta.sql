-- =============================================
-- Proceso: Maestros/Del_SalaVenta
-- =============================================
--START_PARAM
set @id_sala_venta = NULL
--END_PARAM

delete from dim_tipo_turno_sala where id_sala_venta = @id_sala_venta;
delete from dim_campo_obligatorio_sala where id_sala_venta = @id_sala_venta;
delete from dim_sala_venta where id_sala_venta = @id_sala_venta;

select 'OK' as result;