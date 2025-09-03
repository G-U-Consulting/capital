-- =============================================
-- Proceso: Usuarios/Upd_rol
-- =============================================
--START_PARAM
set @id_rol = '2',
    @rol = 'elrol',
    @descripcion = 'ladesc',
    @id_sede = 1,
    @permisos = '5,',
    @created_by = 'alejandros';
--END_PARAM
call fn_list(@permisos, ',');
update fact_roles set
    rol = @rol,
    descripcion = @descripcion,
    id_sede = if(@id_sede = '', NULL, @id_sede)
where id_rol = @id_rol;
delete a
from fact_permisos_roles a
    left join fn_list_result b on a.id_permiso = b.value
where a.id_rol = @id_rol and b.id is null;

insert into fact_permisos_roles(id_permiso, id_rol)
select distinct a.value, @id_rol
from fn_list_result a
    left join fact_permisos_roles b on a.value = b.id_permiso and @id_rol = b.id_rol
where b.id_permiso_rol is null;

select 'OK' as result;