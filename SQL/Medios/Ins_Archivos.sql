-- =============================================
-- Proceso: Medios/Ins_Archivos
-- =============================================
--START_PARAM
set @id_documento,
    @id_proyecto,
    @id_maestro_documento,
    @orden,
    @id_grupo_proyecto,
    @tipo;

--END_PARAM

insert into fact_documento_proyecto (
    id_documento,
    id_proyecto,
    id_maestro_documento,
    orden,
    tipo,
    id_grupo_proyecto
) values (
    @id_documento,
    @id_proyecto,
    @id_maestro_documento,
    @orden,
    @tipo,
    @id_grupo_proyecto
);


select CONCAT('OK-id_archivo:', last_insert_id()) as result;
