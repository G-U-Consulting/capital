-- =============================================
-- Proceso: Proyectos/Ins_Hito
-- =============================================
--START_PARAM
set @titulo = NULL, 
    @descripcion = NULL, 
    @fecha = NULL, 
    @color = NULL, 
    @festivo = '0',
    @id_sala = NULL,
    @id_proyecto = NULL;
--END_PARAM

insert into dim_hito_sala(titulo, descripcion, fecha, color, festivo, id_sala_venta, id_proyecto) 
values(@titulo, @descripcion, @fecha, @color, if(@festivo = '1', 1, 0), @id_sala, @id_proyecto);

select 'OK' as result;