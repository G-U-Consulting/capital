-- =============================================
-- Proceso: Usuarios/Ins_Usuario
-- =============================================
--START_PARAM
set @usuario = 'alejandros',
    @identificacion = '1019054739',
    @nombres = 'Alejandro Salcedo Bernal',
    @email = 'alejandro.salcedo@serlefin.com',
    @id_cargo = '1'
    @roles = '2,5,',
    @created_by = 'admon';
--END_PARAM

insert into fact_usuarios(usuario, identificacion, nombres, email, id_cargo,created_by)
select @usuario, @identificacion, @nombres, @email,@id_cargo, @created_by;
set @id_usuario = last_insert_id();

call fn_list(@roles, ',');
insert into fact_roles_usuarios(id_rol, id_usuario)
select distinct value, @id_usuario
from fn_list_result;

select 'OK' as result;