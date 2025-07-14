-- =============================================
-- Proceso: Salas/Get_Programacion
-- =============================================
--START_PARAM
set @id_sala = NULL;
--END_PARAM

select * from dim_sala_venta where id_sala_venta = @id_sala;