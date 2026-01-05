-- =============================================
-- Proceso: Medios/Del_Archivos
-- =============================================
--START_PARAM
set @id_proyecto,
    @id_grupo_proyecto,
    @id_maestro_documento,
    @id_desistimiento,
    @tipo;
--END_PARAM

update fact_documento_proyecto
set is_active = 0
where
    (@id_proyecto is null or id_proyecto = @id_proyecto)
    and (@id_desistimiento is null or id_desistimiento = @id_desistimiento)
    and tipo = @tipo
    and (
        -- Para logo, slide, planta: id_grupo_proyecto debe ser NULL o 0
        (@tipo in ('logo', 'slide', 'planta') and (@id_grupo_proyecto = 0 or @id_grupo_proyecto is null) and (id_grupo_proyecto is null or id_grupo_proyecto = 0))
        or
        -- Para otros tipos: filtrar por grupo
        (@tipo not in ('logo', 'slide', 'planta') and (@id_grupo_proyecto is null or id_grupo_proyecto = @id_grupo_proyecto))
    )
    and (
        @id_maestro_documento is null
        or id_maestro_documento <=> @id_maestro_documento
    );

select 'OK' as result;
