-- =============================================
-- Proceso: Clientes/Upd_LiberarUnidad
-- =============================================
--START_PARAM
set @id_venta = NULL,
    @usuario = NULL;
--END_PARAM

select u.id_usuario into @userid from fact_usuarios u 
    where u.usuario = @usuario;

update fact_unidades
set id_estado_unidad = 1,
    updated_by = @usuario
where id_unidad in (
    select coalesce(u2.id_unidad, u1.id_unidad)
    from fact_ventas v 
    join fact_unidades u1 on v.id_unidad = u1.id_unidad
    left join fact_unidades u2 on u1.id_agrupacion = u2.id_agrupacion
    where v.id_venta = @id_venta
);

insert into dim_log_unidades(id_unidad, id_usuario, titulo, texto)
select coalesce(u2.id_unidad, u1.id_unidad) as id_unidad, @userid as id_usuario, 
    concat('Cambió estado a <span class="log-color-state" style="background: ', e.color_fondo,
    '; color: ', e.color_fuente, '">', e.estado_unidad, '</span>') as titulo, 
    'Unidad liberada por desistimiento.'
    from fact_ventas v 
    join fact_unidades u1 on v.id_unidad = u1.id_unidad
    left join fact_unidades u2 on u1.id_agrupacion = u2.id_agrupacion
    join dim_estado_unidad e on e.id_estado_unidad = u1.id_estado_unidad collate utf8mb4_unicode_ci
    where v.id_venta = @id_venta;

select 'OK' as result;
