-- =============================================
-- Proceso: Medios/Ins_Archivos
-- =============================================
--START_PARAM
set @id_documento = 1,
    @id_proyecto = 2,
    @id_maestro_documento = 3,
    @orden = 1,
    @id_grupo_proyecto = 4,
    @video = '',
    @descripcion = '',
    @link = '',
    @tipo = '';
--END_PARAM
insert into fact_documento_proyecto (
    id_documento,
    id_proyecto,
    id_maestro_documento,
    orden,
    id_grupo_proyecto,
    video,
    descripcion,
    link,
    tipo
) values (
    @id_documento,
    @id_proyecto,
    @id_maestro_documento,
    @orden,
    @id_grupo_proyecto,
    @video,
    @descripcion,
    @link,
    @tipo
);
select CONCAT('OK-id_archivo:', last_insert_id()) as result;
