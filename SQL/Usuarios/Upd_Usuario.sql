-- =============================================
-- Proceso: Usuarios/Upd_Usuario
-- =============================================
--START_PARAM
set
    @id_usuario = 1,
    @usuario = 'alejandros',
    @identificacion = '1019054739',
    @nombres = 'Alejandro Salcedo Bernal',
    @email = 'alejandro.salcedo@serlefin.com',
    @roles = '2,5,',
    @created_by = 'admon';
--END_PARAM
update fact_usuarios set
    usuario = @usuario, 
    identificacion = @identificacion, 
    nombres = @nombres, 
    email = @email
where id_usuario = @id_usuario;

call fn_list(@roles, ',');
delete a
from fact_roles_usuarios a
    left join fn_list_result b on a.id_rol = b.value
where a.id_usuario = @id_usuario and b.id is null;

insert into fact_roles_usuarios(id_rol, id_usuario)
select distinct a.value, @id_usuario
from fn_list_result a
    left join fact_roles_usuarios b on a.value = b.id_rol and @id_usuario = b.id_usuario
where b.id_rol_usuario is null;

select 'OK' as result;