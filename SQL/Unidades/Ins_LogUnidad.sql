-- =============================================
-- Proceso: Unidades/Ins_Agrupacion
-- =============================================
--START_PARAM
set @id_unidad = NULL,
    @texto = NULL;
--END_PARAM

select e.estado_unidad, e.color_fondo, e.color_fuente
into @estado2, @background, @color
from dim_estado_unidad e
join fact_unidades u on e.id_estado_unidad = u.id_estado_unidad collate utf8mb4_unicode_ci
where u.id_unidad = @id_unidad;

insert into dim_log_unidades(id_unidad, id_usuario, titulo, texto)
values(@id_unidad, 
    (select us.id_usuario 
    from fact_usuarios us
    join fact_unidades un on us.usuario collate utf8mb4_general_ci = un.updated_by
    where un.id_unidad = @id_unidad),
    concat('Cambió estado a <span class="log-color-state" style="background: ', @background,
    '; color: ', @color, '">', @estado2, '</span>'), 
    @texto
);

select concat('OK-id_log:', last_insert_id()) as result;