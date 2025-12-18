-- =============================================
-- Proceso: Salas/Ins_Seguimiento
-- =============================================
--START_PARAM
set @titulo = NULL,
    @descripcion = NULL,
    @fecha = NULL,
    @color = NULL,
    @festivo = '0',
    @frecuencia = NULL,
    @limite = NULL,
    @id_sala_venta = NULL,
    @id_proyecto = NULL,
    @id_torre = NULL,
    @id_unidad = NULL,
    @cargos = '';
--END_PARAM

insert into dim_hito_sala(
    titulo,
    descripcion,
    fecha,
    color,
    festivo,
    frecuencia,
    limite,
    id_sala_venta,
    id_proyecto,
    id_torre,
    id_unidad
)
values(
    @titulo,
    @descripcion,
    @fecha,
    @color,
    if(@festivo = '1', 1, 0),
    @frecuencia,
    if(@frecuencia is null, null, @limite),
    @id_sala_venta,
    @id_proyecto,
    @id_torre,
    @id_unidad
);

set @id_hito = last_insert_id();

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

select concat('OK-id_hito:', @id_hito) as result;
