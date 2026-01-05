-- ================================================
-- Proceso: Medios/Get_Archivo
-- ================================================
--START_PARAM
set @tipo = 'imagenes',
    @id_proyecto = 0,
    @id_grupo_proyecto = 0,
    @id_maestro_documento = 0;
--END_PARAM

select a.id_documento, documento, llave, b.orden, a.is_active, b.tipo, c.id_grupo_proyecto, descripcion , video as nombre , link, nombre as nombre_documento
from fact_documentos a
left join fact_documento_proyecto b on a.id_documento = b.id_documento
left join dim_grupo_proyecto c on c.id_grupo_proyecto = b.id_grupo_proyecto
where b.is_active = 1
  and b.id_proyecto = @id_proyecto
  and b.tipo = @tipo
  and (
        -- Para logo, slide, planta: no usar grupo (id_grupo_proyecto puede ser NULL o 0)
        (@tipo in ('logo', 'slide', 'planta') and (@id_grupo_proyecto = 0 or @id_grupo_proyecto is null))
        or
        -- Para otros tipos: filtrar por grupo
        (@tipo not in ('logo', 'slide', 'planta') and (c.id_grupo_proyecto = @id_grupo_proyecto or b.id_grupo_proyecto = @id_grupo_proyecto))
      )
order by b.orden;