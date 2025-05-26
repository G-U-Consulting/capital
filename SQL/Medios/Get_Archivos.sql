-- ================================================
-- Proceso: Medios/Get_Archivo
-- ================================================
--START_PARAM
set @tipo = 'imagenes',
    @id_proyecto = 0,
    @id_grupo_proyecto = 0,
    @id_maestro_documento = 0;
--END_PARAM

select a.id_documento, documento, llave, b.orden, a.is_active, tipo
from fact_documentos a
left join fact_documento_proyecto b on a.id_documento = b.id_documento
left join dim_grupo_proyecto c on c.id_grupo_proyecto = b.id_grupo_proyecto
where b.is_active = 1
  and (
        (b.id_proyecto = @id_proyecto and (
            @tipo in ('logo', 'slide', 'planta') or c.id_grupo_proyecto = @id_grupo_proyecto
        ) and b.tipo = @tipo)
     or
        (b.tipo like CONCAT('%', @tipo, '%') and 
         (b.id_proyecto = @id_proyecto or b.id_maestro_documento = @id_maestro_documento))
      )
order by b.orden;
