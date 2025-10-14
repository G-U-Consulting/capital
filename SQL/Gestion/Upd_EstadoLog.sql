-- =============================================
-- Proceso: Gestion/Upd_EstadoLog
-- =============================================
--START_PARAM
set @id_unidad = NULL,
    @id_estado_unidad = NULL,
    @texto = NULL,
    @id_lista, NULL,
    @usuario = NULL;
--END_PARAM

select e.id_estado_unidad, e.estado_unidad, e.color_fondo, e.color_fuente
into @id_estado1, @estado1, @background1, @color1
from dim_estado_unidad e
join fact_unidades u on e.id_estado_unidad = u.id_estado_unidad collate utf8mb4_unicode_ci
where u.id_unidad = @id_unidad;

update fact_unidades 
set id_estado_unidad = @id_estado_unidad, id_lista = @id_lista, updated_by = @usuario
where id_unidad = @id_unidad;

select e.id_estado_unidad, e.estado_unidad, e.color_fondo, e.color_fuente
into @id_estado2, @estado2, @background2, @color2
from dim_estado_unidad e
join fact_unidades u on e.id_estado_unidad = u.id_estado_unidad collate utf8mb4_unicode_ci
where u.id_unidad = @id_unidad;

insert into dim_log_unidades(id_unidad, id_usuario, titulo, texto, id_estado_unidad1, id_estado_unidad2)
values(@id_unidad, 
    (select us.id_usuario 
    from fact_usuarios us
    where us.usuario collate utf8mb4_general_ci = @usuario),
    concat('Cambió estado de <span class="log-color-state" style="background: ', @background1,
    '; color: ', @color1, '">', @estado1, '</span>',
    ' a <span class="log-color-state" style="background: ', @background2,
    '; color: ', @color2, '">', @estado2, '</span>'), 
    @texto, @id_estado1, @id_estado2
);

select 'OK' as result;
