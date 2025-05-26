-- =============================================
-- Proceso: Medios/Del_Archivos
-- =============================================
--START_PARAM
set @id_proyecto,
    @id_grupo_proyecto,
    @id_maestro_documento,
    @tipo;
--END_PARAM

update fact_documento_proyecto
set is_active = 0
where (
    id_proyecto = @id_proyecto
    and tipo like CONCAT('%', @tipo, '%')
    and id_grupo_proyecto = @id_grupo_proyecto
)
or (
    id_proyecto = @id_proyecto
    and tipo like CONCAT('%', @tipo, '%')
    and id_maestro_documento = @id_maestro_documento
);

select 'OK' as result;
