-- =============================================
-- Proceso: Unidades/Upd_ListaTorre
-- =============================================
--START_PARAM
set @id_torre = NULL,
    @id_lista = NULL,
    @ids_tipos = '';
--END_PARAM

set @i = 1;
if trim(@ids_tipos) <> '' then
    set @n = length(@ids_tipos) - length(replace(@ids_tipos, ',', '')) + 1;
    while @i <= @n do
        set @id_tipo = trim(substring_index(substring_index(@ids_tipos, ',', @i), ',', -1));
        if @id_tipo <> '' then
            update fact_unidades
            set id_lista = @id_lista
            where id_torre = @id_torre and id_estado_unidad = 1 and id_tipo = @id_tipo;
            update dim_lista_tipo_torre
            set id_lista = @id_lista
            where id_torre = @id_torre and id_tipo = @id_tipo;
        end if;
        set @i = @i + 1;
    end while;
end if;

select 'OK' as result;