-- =============================================
-- Proceso: Medios/Ins_Archivos
-- =============================================
--START_PARAM
set @id_documento = 1,
    @id_proyecto = 2,
    @id_desistimiento = NULL,
    @id_maestro_documento = 3,
    @orden = 1,
    @nombre = '',
    @id_grupo_proyecto = 4,
    @video = '',
    @descripcion = '',
    @extension = '',
    @link = '',
    @tipo = '';
--END_PARAM
insert into fact_documento_proyecto (
    id_documento,
    id_proyecto,
    id_desistimiento,
    id_maestro_documento,
    orden,
    nombre,
    id_grupo_proyecto,
    video,
    descripcion,
    extension,
    link,
    tipo
) values (
    @id_documento,
    @id_proyecto,
    @id_desistimiento,
    @id_maestro_documento,
    @orden,
    @nombre,
    @id_grupo_proyecto,
    @video,
    @descripcion,
    @extension,
    @link,
    @tipo
);
select CONCAT('OK-id_archivo:', last_insert_id()) as result;
