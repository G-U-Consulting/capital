-- =============================================
-- Proceso: Proyectos/Upd_Proyecto2
-- =============================================
--START_PARAM
set @id_proyecto = NULL,
    @id_sala_venta = NULL;

--END_PARAM

update fact_proyectos
set fecha_asignacion_sala = case 
        when @id_sala_venta = id_sala_venta or @id_sala_venta is null or @id_sala_venta = 'null' then fecha_asignacion_sala
        else now()
    end,
    id_sala_venta = if(@id_sala_venta = 'null', null, coalesce(@id_sala_venta, id_sala_venta))
where id_proyecto = @id_proyecto;

select 'OK' as result;