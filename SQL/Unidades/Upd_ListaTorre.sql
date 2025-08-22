-- =============================================
-- Proceso: Unidades/Upd_ListaTorre
-- =============================================
--START_PARAM
set @ids_torres = NULL,
    @id_lista = NULL,
    @id_tipo = NULL;
--END_PARAM


set @i = 1;
if trim(@ids_torres) <> '' then
    set @n = length(@ids_torres) - length(replace(@ids_torres, ',', '')) + 1;
    while @i <= @n do
        set @item = trim(substring_index(substring_index(@ids_torres, ',', @i), ',', -1));
        if @item <> '' then
            if @id_tipo is not null then
                update fact_unidades
                set id_lista = @id_lista
                where id_torre = @item and id_estado_unidad = 1 and id_tipo = @id_tipo;
            else
                update fact_torres
                set id_lista = @id_lista
                where id_torre = @item;

                update fact_unidades
                set id_lista = @id_lista
                where id_torre = @item and id_estado_unidad = 1;
            end if;
        end if;
        set @i = @i + 1;
    end while;
end if;

select 'OK' as result;