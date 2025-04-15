-- =============================================
-- Proceso: Usuarios/Get_Rol
-- =============================================
--START_PARAM
set @id_rol = 9;
--END_PARAM

select a.id_rol, a.rol, a.descripcion, a.id_sede
from fact_roles a
where id_rol = @id_rol;

select a.id_permiso, b.permiso, b.grupo
from fact_permisos_roles a
    join dim_permiso b on a.id_permiso = b.id_permiso
where id_rol = @id_rol;

select a.id_usuario, a.usuario
from fact_usuarios a
    join fact_roles_usuarios b on a.id_usuario = b.id_usuario
where b.id_rol = @id_rol;