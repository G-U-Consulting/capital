-- =============================================
-- Proceso: Proyectos/Upd_Proyecto
-- =============================================
--START_PARAM
set 
    @id_proyecto = 0,

    @nombre = '',
    @direccion = '',
    @id_sede = 0,
    @id_zona_proyecto = 0,
    @id_ciudadela = 0,
    @sala_venta = 0,
    @descripcion_comercial = '',

    @otra_info = '',
    @id_bancos_financiador = 0,
    @id_banco_constructor = 0,
   


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

    @lanzamiento = 0,
    @ciudad_lanzamiento = '',
    @fecha_lanzamiento = '',
    @latitud = '',
    @bloqueo_libres = 0,
    @inmuebles_opcionados = 0,
    @tipos_excluidos = 0,
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
    @bancos_financiadores = '',
    @banco_constructor = '',
    @estado_publicacion = '',
    @tipo_proyecto = '';
--END_PARAM

update fact_proyectos
set 
    nombre = @nombre,
    direccion = @direccion,
    id_sede = nullif(@id_sede, 0),
    id_zona_proyecto = nullif(@id_zona_proyecto, 0),
    id_ciudadela = nullif(@id_ciudadela, 0),
    email_coordinacion_sala = @email_coordinacion_sala,
    otra_info = @otra_info,
    descripcion_comercial = @descripcion_comercial,

    subsidios_vis = @subsidios_vis,
    dias_separacion = @dias_separacion,
    dias_cierre_sala = @dias_cierre_sala,
    meses_ci = @meses_ci,
    dias_pago_ci_banco_amigo = @dias_pago_ci_banco_amigo,
    dias_pago_ci_banco_no_amigo = @dias_pago_ci_banco_no_amigo,
    email_cotizaciones = @email_cotizaciones,
    meta_ventas = @meta_ventas,
    id_pie_legal = nullif(@id_pie_legal, 0),
    id_tipo_financiacion = nullif(@id_tipo_financiacion, 0),
    id_tipo_vis = nullif(@id_tipo_vis, 0),
    id_banco_constructor = nullif(@id_banco_constructor, 0),
    id_bancos_financiador = nullif(@id_bancos_financiador, 0),

    centro_costos = @centro_costos,
    id_fiduciaria = nullif(@id_fiduciaria, 0),
    id_opcion_visual = nullif(@id_opcion_visual, 0),

    lanzamiento = @lanzamiento,
    ciudad_lanzamiento = @ciudad_lanzamiento,
    fecha_lanzamiento = @fecha_lanzamiento,
    latitud = @latitud,
    bloqueo_libres = IFNULL(NULLIF(TRIM(@bloqueo_libres), ''), 0),
    inmuebles_opcionados = @inmuebles_opcionados,
    tipos_excluidos = @tipos_excluidos,
    link_waze = @link_waze,
    linea_whatsapp = @linea_whatsapp,
    id_tipo_proyecto = nullif(@id_tipo_proyecto, 0),

    email_receptor_1 = @email_receptor_1,
    email_receptor_2 = @email_receptor_2,
    email_receptor_3 = @email_receptor_3,
    email_receptor_4 = @email_receptor_4,

    link_general_onelink = @link_general_onelink,
    link_especifico_onelink = @link_especifico_onelink,
    incluir_especificaciones_tecnicias = @incluir_especificaciones_tecnicias,
    link_especificaciones_tecnicias = @link_especificaciones_tecnicias,
    incluir_cartilla_negocios_cotizacion = @incluir_cartilla_negocios_cotizacion,
    incluir_cartilla_negocios_opcion = @incluir_cartilla_negocios_opcion,
    link_cartilla_negocios = @link_cartilla_negocios,
    frame_seguimiento_visible = @frame_seguimiento_visible,
    link_seguimiento_leads = @link_seguimiento_leads,
    frame_evaluacion_conocimiento = @frame_evaluacion_conocimiento,
    link_evaluacion_conocimiento = @link_evaluacion_conocimiento,
    avance_obra_visible = @avance_obra_visible,
    link_avance_obra = @link_avance_obra,
    incluir_brochure = @incluir_brochure,
    link_brochure = @link_brochure
    where id_proyecto = @id_proyecto;


    -- set @datos = @bancos_financiadores;
    -- set @tabla = 'fact_banco_financiador';
    -- set @campo = 'id_banco_financiador';
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

    -- set @datos = @banco_constructor;
    -- set @tabla = 'fact_banco_constructor';
    -- set @campo = 'id_banco_constructor';
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


 set @datos = @sala_venta;
    set @tabla = 'fact_sala_venta';
    set @campo = 'id_sala_venta';
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
