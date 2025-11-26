-- =============================================
-- Proceso: Integraciones/Upd_ListaEspera
-- =============================================
--START_PARAM
set @id_lista = NULL,
    @salesforce_id = NULL;
--END_PARAM

update fact_lista_espera
set salesforce_id = @salesforce_id
where id_lista = @id_lista;

select 'OK' as result