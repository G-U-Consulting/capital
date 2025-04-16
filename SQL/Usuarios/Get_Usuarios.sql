-- =============================================
-- Proceso: Usuarios/Get_Usuarios
-- =============================================
--START_PARAM
set @seachUser = '',
    @id_sede = '2',
    @id_cargo = '2';
--END_PARAM

set @pusuario = concat('%', @seachUser, '%');

select a.id_usuario, a.usuario, a.nombres, date_format(a.created_on, '%Y-%m-%d %T') as created_on,
    (select count(*) from fact_roles_usuarios aa where a.id_usuario = aa.id_usuario) as cuenta,
    b.cargo, a.identificacion, if(a.is_active = true, 1, 0) as is_active
from fact_usuarios a
    left join dim_cargo b on a.id_cargo = b.id_cargo
where (a.usuario like @pusuario collate utf8mb4_unicode_ci
    or a.nombres like @pusuario collate utf8mb4_unicode_ci)
    and (@id_sede = '' or exists(select * from fact_roles_usuarios aa join fact_roles bb on aa.id_rol = bb.id_rol where a.id_usuario = aa.id_usuario and bb.id_sede = @id_sede))
    and (@id_cargo = '' or a.id_cargo = @id_cargo);