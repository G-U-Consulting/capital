-- =============================================
-- Proceso: General/Get_Archivo
-- =============================================
--START_PARAM
set @id_documento = ''

--END_PARAM

select id_archivo, nombre, codigo, orden, id_documento
from dim_documento_archivo
where id_documento = @id_documento
order by orden;