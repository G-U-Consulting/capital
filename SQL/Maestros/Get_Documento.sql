-- =============================================
-- Proceso: General/Get_Documento
-- =============================================
--START_PARAM
set @id_proyecto = ''

--END_PARAM

select id_documento, documento
from dim_documento dd
where is_active = 1  and 
id_documento = ifnull((select ifnull(id_documento,'0') from dim_documento_archivo where id_proyecto=@id_proyecto limit 1),'0')
order by documento;