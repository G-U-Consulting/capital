-- =============================================
-- Proceso: Unidades/Upd_OrdenTorres
-- =============================================
--START_PARAM
set @id_torre1 = NULL, 
    @orden_torre1 = NULL,
    @id_torre2 = NULL, 
    @orden_torre2 = NULL;
--END_PARAM

update fact_torres
set orden_salida = @orden_torre1
where id_torre = @id_torre1;
update fact_torres
set orden_salida = @orden_torre2
where id_torre = @id_torre2;

select 'OK' as result;