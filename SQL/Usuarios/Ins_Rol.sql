-- =============================================
-- Proceso: Usuarios/Ins_rol
-- =============================================
--START_PARAM
set @rol = 'Prueba',
    @permisos = '1,2,3,',
    @descripcion = 'La descripción',
    @created_by = 'alejandros';
--END_PARAM

insert into fact_roles(rol, descripcion, created_by)
select left(@rol, 100), left(@descripcion, 1000), @created_by;
set @id_rol = last_insert_id();
call fn_list(@permisos, ',');
insert into fact_permisos_roles(id_permiso, id_rol)
select distinct value, @id_rol
from fn_list_result;

select @id_rol as id_rol;