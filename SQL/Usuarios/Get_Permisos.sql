-- =============================================
-- Proceso: Usuarios/Get_Permisos
-- =============================================
--START_PARAM
--END_PARAM
select id_permiso, permiso, grupo
from dim_permiso
where is_active = 1;