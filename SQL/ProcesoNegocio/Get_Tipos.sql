-- =============================================
-- Proceso: ProcesoNegocio/Get_Tipos
-- =============================================
--START_PARAM
set @id_proyecto = 3,
    @id_unidad = 26275,
    @tipo = 'recorridos virt';
--END_PARAM

select a.id_documento, b.id_documento_proyecto, a.documento,
    llave, orden, a.is_active, b.id_grupo_proyecto, b.tipo, b.link, b.video, b.descripcion, nombre as nombre_documento, c.id_tipo, d.id_unidad
from fact_documentos a
join fact_documento_proyecto b on a.id_documento = b.id_documento
left join dim_tipo_unidad c 
  on b.id_documento_proyecto = 
        case 
            when @tipo = 'recorridos virt' then c.id_archivo_recorrido
            when @tipo = 'imagenes'then c.id_archivo_planta
        end
left join fact_unidades d on c.id_tipo = d.id_tipo
where FIND_IN_SET(b.tipo, @tipo collate utf8mb4_unicode_ci)  and b.id_proyecto = @id_proyecto and b.is_active = 1 and d.id_unidad = @id_unidad
order by orden;


