-- =============================================
-- Proceso: Usuarios/Get_RolesUsuario
-- =============================================
--START_PARAM
set @username = 'prueba';
--END_PARAM

select fr.id_rol, fr.rol
from fact_roles fr
    join fact_roles_usuarios fru on fr.id_rol = fru.id_rol
    join fact_usuarios fu on fu.id_usuario = fru.id_usuario
where fu.usuario = @username;

select dp.id_permiso, dp.permiso
from fact_roles fr
    join fact_roles_usuarios fru on fr.id_rol = fru.id_rol
    join fact_usuarios fu on fru.id_usuario = fu.id_usuario
    join fact_permisos_roles fpr on fr.id_rol = fpr.id_rol
    join dim_permiso dp on fpr.id_permiso = dp.id_permiso
where fu.usuario = @username group by id_permiso;
