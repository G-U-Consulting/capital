-- =============================================
-- Proceso: Usuarios/Get_Roles
-- =============================================
--START_PARAM
set @rol = '';
--END_PARAM

set @prol = concat('%', @rol, '%');

select a.id_rol, a.rol, date_format(a.created_on, '%Y-%m-%d %T') as created_on
from fact_roles a
where a.rol like @prol collate utf8mb4_unicode_ci;