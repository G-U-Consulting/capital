-- =============================================
-- Proceso: Integraciones/Upd_Cotizacion
-- =============================================
--START_PARAM
set @id_unidad = NULL,
    @apartment_id = NULL,
    @id_negocios_unidades = NULL,
    @opportunity_id = NULL;
--END_PARAM

update fact_unidades
set salesforce_id = @apartment_id
where id_unidad = @id_unidad;
update fact_negocios_unidades
set salesforce_oportunidad_id = @opportunity_id
where id_negocios_unidades = @id_negocios_unidades;

select 'OK' as result;
select * from fact_unidades where id_unidad = 91032;