-- =============================================
-- Proceso: Unidades/Upd_ListaTorre
-- =============================================
--START_PARAM
set @id_torre = NULL,
    @id_lista = NULL,
    @id_tipo = '';
--END_PARAM

if @id_tipo <> '' then
    update fact_unidades
    set id_lista = @id_lista
    where id_torre = @id_torre and id_estado_unidad = 1 and id_tipo = @id_tipo;
    update dim_lista_tipo_torre
    set id_lista = @id_lista
    where id_torre = @id_torre and id_tipo = @id_tipo;
else
    update fact_unidades
    set id_lista = @id_lista
    where id_torre = @id_torre and id_estado_unidad = 1;
    update dim_lista_tipo_torre
    set id_lista = @id_lista
    where id_torre = @id_torre;
end if;

select 'OK' as result;