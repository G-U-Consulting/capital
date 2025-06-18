-- =============================================
-- Proceso: Proyectos/Upd_Proyecto2
-- =============================================
--START_PARAM
set @id_proyecto = NULL,
    @id_sala_venta = NULL,
    @is_active = NULL;

--END_PARAM

update fact_proyectos
set fecha_asignacion_sala = case 
        when @id_sala_venta = id_sala_venta or @id_sala_venta is null or @id_sala_venta = 'null' then fecha_asignacion_sala
        else now()
    end,
    id_sala_venta = if(@id_sala_venta = 'null', null, coalesce(@id_sala_venta, id_sala_venta)),
    is_active = if(@is_active is null, is_active, if(@is_active = '0', 0, 1))
where id_proyecto = @id_proyecto;

select 'OK' as result;

SELECT * from fact_proyectos where is_active = 1;