-- =============================================
-- Proceso: Usuarios/Get_Usuarios
-- =============================================
--START_PARAM
set @id_usuario = '6';
--END_PARAM

select a.id_usuario, a.usuario, a.identificacion, a.nombres, a.email, b.id_cargo 
from fact_usuarios a
    left join dim_cargo b on a.id_cargo = b.id_cargo
where id_usuario = @id_usuario;

select a.id_rol, b.rol
from fact_roles_usuarios a
    join fact_roles b on a.id_rol = b.id_rol
where a.id_usuario = @id_usuario;

