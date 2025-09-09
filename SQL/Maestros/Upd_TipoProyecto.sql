-- =============================================
-- Proceso: General/Upd_TipoProyecto
-- =============================================
--START_PARAM
set @id_tipo_proyecto = NULL,
    @tipo_proyecto = NULL,
    @codigo = NULL,
    @is_active = NULL;
--END_PARAM

select codigo into @code from dim_tipo_proyecto where id_tipo_proyecto = @id_tipo_proyecto;

UPDATE dim_tipo_proyecto
    SET tipo_proyecto = @tipo_proyecto,
        is_active = if(@is_active = '0', 0, 1),
        codigo = @codigo
    WHERE id_tipo_proyecto = @id_tipo_proyecto;

if @codigo <> @code collate utf8mb4_unicode_ci and @code != '' and @code is not null then
    update dim_agrupacion_unidad a
    join (
        select 
            u.id_agrupacion,
            concat(tpp.codigo, ' ', un.numero_apartamento, ' - T', ft.consecutivo) as nombre,
            group_concat(
                concat(tp.codigo, ': ', u.numero_apartamento) 
                order by tp.tipo_proyecto asc SEPARATOR ', ') as descripcion
            from fact_unidades u
            left join fact_torres ft on u.id_torre = ft.id_torre
            join dim_tipo_proyecto tp on u.id_clase = tp.id_tipo_proyecto
            join fact_proyectos p on u.id_proyecto = p.id_proyecto
            join dim_tipo_proyecto tpp on p.id_tipo_proyecto = tpp.id_tipo_proyecto
            join fact_unidades un on u.id_agrupacion = un.id_agrupacion and tpp.id_tipo_proyecto = un.id_clase
            where u.id_agrupacion is not null
            group by u.id_agrupacion, tpp.id_tipo_proyecto, ft.id_torre
    ) t on a.id_agrupacion = t.id_agrupacion
    set a.nombre = t.nombre,
        a.descripcion = t.descripcion;
end if;

select 'OK' as result;