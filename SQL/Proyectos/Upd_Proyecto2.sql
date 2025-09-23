-- =============================================
-- Proceso: Proyectos/Upd_Proyecto2
-- =============================================
--START_PARAM
set @id_proyecto = '3',
    @is_active = '1';

--END_PARAM

update fact_proyectos
set is_active = if(@is_active is null, is_active, if(@is_active = '0', 0, 1))
where id_proyecto = @id_proyecto;

select 'OK' as result;
