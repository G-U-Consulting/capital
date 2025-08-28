-- =============================================
-- Proceso: Salas/Upd_Personal
-- =============================================
--START_PARAM
set @id_sala_venta = NULL,
    @id_usuario = NULL,
    @permanente = '0';
--END_PARAM
update dim_personal_sala
set permanente = if(@permanente = '0', 0, 1)
where id_sala_venta = @id_sala_venta and id_usuario = @id_usuario;

select 'OK' as result;