-- =============================================
-- Proceso: Proyectos/Ins_Personal
-- =============================================
--START_PARAM
set @id_sala = NULL,
    @id_usuario = NULL;
--END_PARAM

insert into dim_personal_sala(id_sala_venta, id_usuario) values(cast(@id_sala as unsigned), cast(@id_usuario as unsigned));

select 'OK' as result;