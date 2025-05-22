-- =============================================
-- Proceso: Medios/Get_Archivo
-- =============================================
--START_PARAM
set @tipo = 'Imagenes',
	@id_proyecto = 0;
--END_PARAM

select a.id_documento,documento,llave, orden, a.is_active
from fact_documentos a
join fact_documento_proyecto b on a.id_documento = b.id_documento
where b.tipo like CONCAT('%', @tipo, '%') and id_proyecto = @id_proyecto and b.is_active = 1
order by orden;