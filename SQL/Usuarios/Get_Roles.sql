-- =============================================
-- Proceso: Usuarios/Get_Roles
-- =============================================
--START_PARAM
set @rol = '';
--END_PARAM

set @prol = concat('%', @rol, '%');

select a.id_rol, a.rol, a.descripcion,date_format(a.created_on, '%Y-%m-%d %T') as created_on,
    (select count(*) from fact_roles_usuarios aa where a.id_rol = aa.id_rol) as cuenta
from fact_roles a
where a.rol like @prol collate utf8mb4_unicode_ci;