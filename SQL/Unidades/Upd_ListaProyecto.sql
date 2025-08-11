-- =============================================
-- Proceso: Unidades/Upd_ListaProyecto
-- =============================================
--START_PARAM
set @id_proyecto = NULL,
    @id_lista = NULL,
    @alerta_cambio_lista = NULL;
--END_PARAM

update fact_proyectos
set id_lista = @id_lista, 
    alerta_cambio_lista = @alerta_cambio_lista
where id_proyecto = @id_proyecto;

select 'OK' as result;