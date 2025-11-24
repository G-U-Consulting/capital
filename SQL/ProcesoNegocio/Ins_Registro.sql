-- =============================================
-- Proceso: ProcesoNegocio/Ins_Registro
-- =============================================
--START_PARAM
set @id_cliente = '',
    @tipo_registro = '',
    @modo_atencion = '',
    @id_categoria = '',
    @id_medio = '',
    @id_motivo_compra = '', 
    @id_referencia = '',
    @otro_texto = '',
    @id_proyecto = '',
    @descripcion = '',
    @id_presupuesto_vivienda = '',
    @usuario = '',
    @id_tipo_tramite = '',
    @id_sala_venta = NULL,
    @id_modo_atencion = NULL,
    @id_tipo_registro = NULL;  
--END_PARAM

insert into fact_visitas (id_cliente, id_categoria_medio, id_medio, id_motivo_compra, id_referencia, otro_texto ,id_proyecto, descripcion, id_presupuesto_vivienda,id_tipo_tramite, created_by, id_sala_venta, id_modo_atencion, id_tipo_registro)
    values (@id_cliente, @id_categoria, @id_medio, @id_motivo_compra, @id_referencia, @otro_texto, @id_proyecto, @descripcion, @id_presupuesto_vivienda,@id_tipo_tramite, @usuario, @id_sala_venta, @id_modo_atencion, @id_tipo_registro);
set @id_visita = last_insert_id();
/*     
    set @datos = @tipo_registro;
    set @tabla = 'fact_tipo_registro';
    set @campo = 'id_tipo_registro';
    set @i = 1;
    
    if trim(@datos) <> '' then
        set @sql = concat('delete from ', @tabla, ' where id_visita = ', @id_visita);
        prepare stmt from @sql;
        execute stmt;
        deallocate prepare stmt;
    
        set @n = length(@datos) - length(replace(@datos, ',', '')) + 1;
        while @i <= @n do
            set @item = trim(substring_index(substring_index(@datos, ',', @i), ',', -1));
            if @item <> '' then
                    set @sql = concat('insert into ', @tabla, ' (id_visita, ', @campo, ') values (', @id_visita, ',', cast(@item as unsigned), ')');
                prepare stmt from @sql;
                execute stmt;
                deallocate prepare stmt;
            end if;
            set @i = @i + 1;
        end while;
    end if;

    set @datos = @modo_atencion;
    set @tabla = 'fact_modo_atencion';
    set @campo = 'id_modo_atencion';
    set @i = 1;
    
    if trim(@datos) <> '' then
        set @sql = concat('delete from ', @tabla, ' where id_visita = ', @id_visita);
        prepare stmt from @sql;
        execute stmt;
        deallocate prepare stmt;
    
        set @n = length(@datos) - length(replace(@datos, ',', '')) + 1;
        while @i <= @n do
            set @item = trim(substring_index(substring_index(@datos, ',', @i), ',', -1));
            if @item <> '' then
                set @sql = concat('insert into ', @tabla, ' (id_visita, ', @campo, ') values (', @id_visita, ',', cast(@item as unsigned), ')');
                prepare stmt from @sql;
                execute stmt;
                deallocate prepare stmt;
            end if;
            set @i = @i + 1;
        end while;
    end if;
 */
insert into cola_tareas_rpa(tipo, sub_tipo, datos) 
values('salesforce', 'VisitaSF', concat('{"id_visita":', @id_visita, '}'));

select concat('OK-id_visita:', @id_visita) as result;
