-- =============================================
-- Proceso: Unidades/Upd_Unidades
-- =============================================
--START_PARAM
set @id_agrupacion = NULL,
    @ids_unidades = '';
--END_PARAM

update fact_unidades set id_agrupacion = null where id_agrupacion = @id_agrupacion;
set @i = 1;
if trim(@ids_unidades) <> '' then
    set @n = length(@ids_unidades) - length(replace(@ids_unidades, ',', '')) + 1;
    while @i <= @n do
        set @item = trim(substring_index(substring_index(@ids_unidades, ',', @i), ',', -1));
        if @item <> '' then
            update fact_unidades set id_agrupacion = @id_agrupacion where id_unidad = @item;
        end if;
        set @i = @i + 1;
    end while;
end if;

select 'OK' as result;