-- =============================================
-- Proceso: Unidades/Upd_Torre
-- =============================================
--START_PARAM
set @id_torre = NULL, 
    @en_venta = NULL, 
    @aptos_fila = NULL, 
    @id_sinco = NULL, 
    @fecha_p_equ = NULL, 
    @fecha_inicio_obra = NULL, 
    @fecha_escrituracion = NULL, 
    @tasa_base = NULL, 
    @antes_p_equ = NULL, 
    @despues_p_equ = NULL, 
    @id_fiduciaria = NULL, 
    @cod_proyecto_fid = NULL, 
    @nit_fid_doc_cliente = NULL, 
    @id_instructivo = NULL, 
    @propuesta_pago = NULL;
--END_PARAM

update fact_torres
set en_venta = if(@en_venta = '1', 1, 0),
    aptos_fila = @aptos_fila,
    id_sinco = @id_sinco,
    fecha_p_equ = @fecha_p_equ,
    fecha_inicio_obra = @fecha_inicio_obra,
    fecha_escrituracion = @fecha_escrituracion,
    tasa_base = @tasa_base,
    antes_p_equ = @antes_p_equ,
    despues_p_equ = @despues_p_equ,
    id_fiduciaria = @id_fiduciaria,
    cod_proyecto_fid = @cod_proyecto_fid,
    nit_fid_doc_cliente = @nit_fid_doc_cliente,
    id_instructivo = @id_instructivo,
    propuesta_pago = if(@propuesta_pago = '1', 1, 0)
where id_torre = @id_torre;

select 'OK' as result;