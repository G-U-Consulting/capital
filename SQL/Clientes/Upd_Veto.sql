-- =============================================
-- Proceso: Clientes/Upd_Veto
-- =============================================
--START_PARAM
set @id_veto = NULL,
    @vigente = NULL,
    @usuario = NULL;
--END_PARAM

update dim_veto_cliente
set vigente = if(@vigente = '1', 1, 0),
    vetado_por = @usuario
where id_veto = @id_veto;

select 'OK' as result;