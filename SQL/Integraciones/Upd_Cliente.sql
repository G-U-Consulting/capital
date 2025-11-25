-- =============================================
-- Proceso: Integraciones/Upd_Cliente
-- =============================================
--START_PARAM
set @id_cliente = NULL,
    @salesforce_id = NULL;
--END_PARAM

update fact_clientes
set salesforce_id = @salesforce_id
where id_cliente = @id_cliente;