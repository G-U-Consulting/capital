-- =============================================
-- Proceso: Usuarios/Get_Usuarios
-- =============================================
--START_PARAM
set @id_usuario = '6';
--END_PARAM

select a.id_usuario, a.usuario, a.identificacion, a.nombres, a.email
from fact_usuarios a
where id_usuario = @id_usuario;

select a.id_rol, b.rol
from fact_roles_usuarios a
    join fact_roles b on a.id_rol = b.id_rol
where a.id_usuario = @id_usuario;