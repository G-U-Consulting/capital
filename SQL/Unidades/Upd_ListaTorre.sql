-- =============================================
-- Proceso: Unidades/Upd_ListaTorre
-- =============================================
--START_PARAM
set @id_torre = NULL,
    @id_lista = NULL;
--END_PARAM

update fact_torres
set id_lista = @id_lista
where id_torre = @id_torre;

update fact_unidades
set id_lista = @id_lista
where id_torre = @id_torre and id_estado_unidad = 1;

select 'OK' as result;