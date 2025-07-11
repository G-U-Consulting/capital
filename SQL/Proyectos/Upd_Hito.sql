-- =============================================
-- Proceso: Proyectos/Upd_Hito
-- =============================================
--START_PARAM
set @id_hito = NULL,
    @titulo = NULL, 
    @descripcion = NULL, 
    @fecha = NULL, 
    @color = NULL, 
    @festivo = '0',
    @id_sala = NULL,
    @id_proyecto = NULL,
    @cargos = '';
--END_PARAM

update dim_hito_sala
set titulo = @titulo,
    descripcion = @descripcion, 
    fecha = @fecha, 
    color = @color, 
    festivo = if(@festivo = '1', 1, 0),
    frecuencia = @frecuencia,
    limite = if(@frecuencia is null, null, @limite),
    id_sala_venta = @id_sala,
    id_proyecto = @id_proyecto
where id_hito = @id_hito;

set @datos = @cargos;
set @tabla = 'dim_hito_cargo';
set @campo = 'id_cargo';
set @i = 1;

if trim(@datos) <> '' then
    set @sql = concat('delete from ', @tabla, ' where id_hito = ', @id_hito);
    prepare stmt from @sql;
    execute stmt;
    deallocate prepare stmt;

    set @n = length(@datos) - length(replace(@datos, ',', '')) + 1;
    while @i <= @n do
        set @item = trim(substring_index(substring_index(@datos, ',', @i), ',', -1));
        if @item <> '' then
            set @sql = concat('insert into ', @tabla, ' (id_hito, ', @campo, ') values (', @id_hito, ',', cast(@item as unsigned), ')');
            prepare stmt from @sql;
            execute stmt;
            deallocate prepare stmt;
        end if;
        set @i = @i + 1;
    end while;
end if;

select 'OK' as result;