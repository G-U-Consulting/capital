-- =============================================
-- Proceso: General/Get_Documento
-- =============================================
--START_PARAM
set @documento = '',
    @is_img = 0

--END_PARAM

select id_documento, documento
from dim_documento dd
where is_active = 1  and FIND_IN_SET(documento, @documento collate utf8mb4_unicode_ci) and is_img = @is_img
order by documento;