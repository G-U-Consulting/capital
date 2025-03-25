-- =============================================
-- Proceso: Usuarios/Get_Permisos
-- =============================================
--START_PARAM
--END_PARAM
select a.id_permiso, a.permiso, a.grupo, b.zona, b.id_zona
from dim_permiso a
    join dim_zona b on a.id_zona = b.id_zona
where a.is_active = 1;