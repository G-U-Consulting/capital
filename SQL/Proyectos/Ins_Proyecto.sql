-- =============================================
-- Proceso: Proyectos/Ins_Proyecto
-- =============================================
--START_PARAM
set 
    @nombre = '',
    @direccion = '',
    @id_sede = 0,
    @id_zona_proyecto = 0,
    @id_ciudadela = 0,
    @otra_info = '',

    @subsidios_vis = '',
    @dias_separacion = '',
    @dias_cierre_sala = '',
    @meses_ci = '',
    @dias_pago_ci_banco_amigo = '',
    @dias_pago_ci_banco_no_amigo = '',
    @email_cotizaciones = '',
    @meta_ventas = '',
    @email_coordinacion_sala = '',
    @id_pie_legal = 0,
    @id_tipo_financiacion = 0,
    @id_tipo_vis = 0,

    @centro_costos = '',
    @id_fiduciaria = 0,
    @id_opcion_visual = 0,

    @lanzamiento = '',
    @ciudad_lanzamiento = '',
    @fecha_lanzamiento = '',
    @latitud = '',
    @bloqueo_libres = '',
    @inmuebles_opcionados = '',
    @tipos_excluidos = '',
    @link_waze = '',
    @linea_whatsapp = '',
    @id_tipo_proyecto = 0,

    @email_receptor_1 = '',
    @email_receptor_2 = '',
    @email_receptor_3 = '',
    @email_receptor_4 = '',

    @link_general_onelink = '',
    @link_especifico_onelink = '',
    @incluir_especificaciones_tecnicias = '',
    @link_especificaciones_tecnicias = '',
    @incluir_cartilla_negocios_cotizacion = '',
    @incluir_cartilla_negocios_opcion = '',
    @link_cartilla_negocios = '',
    @frame_seguimiento_visible = '',
    @link_seguimiento_leads = '',
    @frame_evaluacion_conocimiento = '',
    @link_evaluacion_conocimiento = '',
    @avance_obra_visible = '',
    @link_avance_obra = '',
    @incluir_brochure = '',
    @link_brochure = '',
    @banco_constructor = '',
    @bancos_financiadores = '',
    @estado_publicacion = '',
    @tipo_proyecto = '';
--END_PARAM

insert into fact_proyectos (
    nombre,
    direccion,
    id_sede,
    id_zona_proyecto,
    id_ciudadela,
    otra_info,

    subsidios_vis,
    dias_separacion,
    dias_cierre_sala,
    meses_ci,
    dias_pago_ci_banco_amigo,
    dias_pago_ci_banco_no_amigo,
    email_cotizaciones,
    meta_ventas,
    email_coordinacion_sala,
    id_pie_legal,
    id_tipo_vis,

    centro_costos,
    id_fiduciaria,
    id_opcion_visual,
    id_tipo_proyecto,

    lanzamiento,
    ciudad_lanzamiento,
    fecha_lanzamiento,
    latitud,
    bloqueo_libres,
    inmuebles_opcionados,
    tipos_excluidos,
    link_waze,
    linea_whatsapp,

    email_receptor_1,
    email_receptor_2,
    email_receptor_3,
    email_receptor_4,

    link_general_onelink,
    link_especifico_onelink,
    incluir_especificaciones_tecnicias,
    link_especificaciones_tecnicias,
    incluir_cartilla_negocios_cotizacion,
    incluir_cartilla_negocios_opcion,
    link_cartilla_negocios,
    frame_seguimiento_visible,
    link_seguimiento_leads,
    frame_evaluacion_conocimiento,
    link_evaluacion_conocimiento,
    avance_obra_visible,
    link_avance_obra,
    incluir_brochure,
    link_brochure
)
select 
    @nombre,
    @direccion,
    nullif(@id_sede, 0),
    nullif(@id_zona_proyecto, 0),
    nullif(@id_ciudadela, 0),
    @otra_info,

    @subsidios_vis,
    @dias_separacion,
    @dias_cierre_sala,
    @meses_ci,
    @dias_pago_ci_banco_amigo,
    @dias_pago_ci_banco_no_amigo,
    @email_cotizaciones,
    @meta_ventas,
    @email_coordinacion_sala,
    nullif(@id_pie_legal, 0),
    nullif(@id_tipo_vis, 0),

    @centro_costos,
    nullif(@id_fiduciaria, 0),
    nullif(@id_opcion_visual, 0),
    nullif(@id_tipo_proyecto, 0),

    @lanzamiento,
    @ciudad_lanzamiento,
    @fecha_lanzamiento,
    @latitud,
    @bloqueo_libres,
    @inmuebles_opcionados,
    @tipos_excluidos,
    @link_waze,
    @linea_whatsapp,

    @email_receptor_1,
    @email_receptor_2,
    @email_receptor_3,
    @email_receptor_4,

    @link_general_onelink,
    @link_especifico_onelink,
    @incluir_especificaciones_tecnicias,
    @link_especificaciones_tecnicias,
    @incluir_cartilla_negocios_cotizacion,
    @incluir_cartilla_negocios_opcion,
    @link_cartilla_negocios,
    @frame_seguimiento_visible,
    @link_seguimiento_leads,
    @frame_evaluacion_conocimiento,
    @link_evaluacion_conocimiento,
    @avance_obra_visible,
    @link_avance_obra,
    @incluir_brochure,
    @link_brochure;

    set @id_proyecto = last_insert_id();
    
    set @datos = @bancos_financiadores;
    set @tabla = 'fact_banco_financiador';
    set @campo = 'id_banco_financiador';
    set @i = 1;
    
    if trim(@datos) <> '' then
        set @sql = concat('delete from ', @tabla, ' where id_proyecto = ', @id_proyecto);
        prepare stmt from @sql;
        execute stmt;
        deallocate prepare stmt;
    
        set @n = length(@datos) - length(replace(@datos, ',', '')) + 1;
        while @i <= @n do
            set @item = trim(substring_index(substring_index(@datos, ',', @i), ',', -1));
            if @item <> '' then
                set @sql = concat('insert into ', @tabla, ' (id_proyecto, ', @campo, ') values (', @id_proyecto, ',', cast(@item as unsigned), ')');
                prepare stmt from @sql;
                execute stmt;
                deallocate prepare stmt;
            end if;
            set @i = @i + 1;
        end while;
    end if;
    
    set @datos = @banco_constructor;
    set @tabla = 'fact_banco_constructor';
    set @campo = 'id_banco_constructor';
    set @i = 1;
    
    if trim(@datos) <> '' then
        set @sql = concat('delete from ', @tabla, ' where id_proyecto = ', @id_proyecto);
        prepare stmt from @sql;
        execute stmt;
        deallocate prepare stmt;
    
        set @n = length(@datos) - length(replace(@datos, ',', '')) + 1;
        while @i <= @n do
            set @item = trim(substring_index(substring_index(@datos, ',', @i), ',', -1));
            if @item <> '' then
                set @sql = concat('insert into ', @tabla, ' (id_proyecto, ', @campo, ') values (', @id_proyecto, ',', cast(@item as unsigned), ')');
                prepare stmt from @sql;
                execute stmt;
                deallocate prepare stmt;
            end if;
            set @i = @i + 1;
        end while;
    end if;
    
    set @datos = @estado_publicacion;
    set @tabla = 'fact_estado_publicacion';
    set @campo = 'id_estado_publicacion';
    set @i = 1;
    
    if trim(@datos) <> '' then
        set @sql = concat('delete from ', @tabla, ' where id_proyecto = ', @id_proyecto);
        prepare stmt from @sql;
        execute stmt;
        deallocate prepare stmt;
    
        set @n = length(@datos) - length(replace(@datos, ',', '')) + 1;
        while @i <= @n do
            set @item = trim(substring_index(substring_index(@datos, ',', @i), ',', -1));
            if @item <> '' then
                set @sql = concat('insert into ', @tabla, ' (id_proyecto, ', @campo, ') values (', @id_proyecto, ',', cast(@item as unsigned), ')');
                prepare stmt from @sql;
                execute stmt;
                deallocate prepare stmt;
            end if;
            set @i = @i + 1;
        end while;
    end if;

    -- set @datos = @tipo_proyecto;
    -- set @tabla = 'fact_tipo_proyecto';
    -- set @campo = 'id_tipo_proyecto';
    -- set @i = 1;
    
    -- if trim(@datos) <> '' then
    --     set @sql = concat('delete from ', @tabla, ' where id_proyecto = ', @id_proyecto);
    --     prepare stmt from @sql;
    --     execute stmt;
    --     deallocate prepare stmt;
    
    --     set @n = length(@datos) - length(replace(@datos, ',', '')) + 1;
    --     while @i <= @n do
    --         set @item = trim(substring_index(substring_index(@datos, ',', @i), ',', -1));
    --         if @item <> '' then
    --             set @sql = concat('insert into ', @tabla, ' (id_proyecto, ', @campo, ') values (', @id_proyecto, ',', cast(@item as unsigned), ')');
    --             prepare stmt from @sql;
    --             execute stmt;
    --             deallocate prepare stmt;
    --         end if;
    --         set @i = @i + 1;
    --     end while;
    -- end if;
    
    select concat('OK-id_proyecto:', @id_proyecto) as resp;
