-- =============================================
-- Proceso: Proyectos/Upd_Hito
-- =============================================
--START_PARAM
set @id_hito = NULL,
    @titulo = NULL, 
    @descripcion = NULL, 
    @fecha = NULL, 
    @color = NULL, 
    @festivo = '0',
    @id_sala = NULL,
    @id_proyecto = NULL;
--END_PARAM

update dim_hito_sala
set titulo = @titulo,
    descripcion = @descripcion, 
    fecha = @fecha, 
    color = @color, 
    festivo = if(@festivo = '1', 1, 0),
    id_sala_venta = @id_sala,
    id_proyecto = @id_proyecto
where id_hito = @id_hito;

select 'OK' as result;