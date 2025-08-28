-- =============================================
-- Proceso: Salas/Ins_Personal
-- =============================================
--START_PARAM
set @id_sala_venta = NULL,
    @id_usuario = NULL;
--END_PARAM

insert into dim_personal_sala(id_sala_venta, id_usuario) values(cast(@id_sala_venta as unsigned), cast(@id_usuario as unsigned));

select concat('OK-id_personal:', last_insert_id()) as result;