-- =============================================
-- Proceso: Salas/Del_Personal
-- =============================================
--START_PARAM
set @id_sala = NULL,
    @id_usuario = NULL;
--END_PARAM

delete from dim_personal_sala where id_sala_venta = @id_sala and id_usuario = @id_usuario;

select 'OK' as result;