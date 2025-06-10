-- =============================================
-- Proceso: Presentacion/Ins_Presentacion
-- =============================================
--START_PARAM
set @id_documento = '',  
    @tipo = '',
    @orden = 1;
--END_PARAM
insert into fact_documento_proyecto (
    id_documento,
    tipo,
    orden
) values (
    @id_documento,
    @tipo,
    @orden
);
select CONCAT('OK-id_archivo:', last_insert_id()) as result;
