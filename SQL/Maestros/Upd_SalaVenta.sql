-- =============================================
-- Proceso: Maestros/Upd_SalaVenta
-- =============================================
--START_PARAM
set
    @id_sala_venta = NULL,
    @sala_venta = NULL,
    @encuesta_vpn = NULL,
    @id_sede = NULL,
    @id_playlist = NULL,
    @tipos_turno = '',
    @campos_obligatorios = '',
    @is_active = '0'
--END_PARAM

UPDATE dim_sala_venta
    SET sala_venta = @sala_venta,
        encuesta_vpn = @encuesta_vpn,
        id_sede = @id_sede,
        id_playlist = @id_playlist,
        is_active = if(@is_active = '0', 0, 1)
    WHERE id_sala_venta = @id_sala_venta;


set @datos = @tipos_turno;
set @tabla = 'dim_tipo_turno_sala';
set @campo = 'id_tipo_turno';
set @i = 1;

if trim(@datos) <> '' then
    set @sql = concat('delete from ', @tabla, ' where id_sala_venta = ', @id_sala_venta);
    prepare stmt from @sql;
    execute stmt;
    deallocate prepare stmt;

    set @n = length(@datos) - length(replace(@datos, ',', '')) + 1;
    while @i <= @n do
        set @item = trim(substring_index(substring_index(@datos, ',', @i), ',', -1));
        if @item <> '' then
            set @sql = concat('insert into ', @tabla, ' (id_sala_venta, ', @campo, ') values (', @id_sala_venta, ',', cast(@item as unsigned), ')');
            prepare stmt from @sql;
            execute stmt;
            deallocate prepare stmt;
        end if;
        set @i = @i + 1;
    end while;
end if;


set @datos = @campos_obligatorios;
set @tabla = 'dim_campo_obligatorio_sala';
set @campo = 'id_campo';
set @i = 1;

if trim(@datos) <> '' then
    set @sql = concat('delete from ', @tabla, ' where id_sala_venta = ', @id_sala_venta);
    prepare stmt from @sql;
    execute stmt;
    deallocate prepare stmt;

    set @n = length(@datos) - length(replace(@datos, ',', '')) + 1;
    while @i <= @n do
        set @item = trim(substring_index(substring_index(@datos, ',', @i), ',', -1));
        if @item <> '' then
            set @sql = concat('insert into ', @tabla, ' (id_sala_venta, ', @campo, ') values (', @id_sala_venta, ',', cast(@item as unsigned), ')');
            prepare stmt from @sql;
            execute stmt;
            deallocate prepare stmt;
        end if;
        set @i = @i + 1;
    end while;
end if;

select 'OK' as result;