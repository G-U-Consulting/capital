-- =============================================
-- Proceso: Medios/Ins_Archivos
-- =============================================
--START_PARAM
set @id_documento,
    @id_proyecto,
    @orden,
    @tipo;

--END_PARAM
insert into fact_documento_proyecto (
    id_documento,
    id_proyecto,
    orden,
    tipo
) values (
    @id_documento,
    @id_proyecto,
    @orden,
    @tipo
);


select CONCAT('OK-id_archivo:', last_insert_id()) as result;
