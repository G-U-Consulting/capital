-- =============================================
-- Proceso: Usuarios/Get_Roles
-- =============================================
--START_PARAM
set @rol = '',
    @id_sede = '';

--END_PARAM

set @prol = concat('%', @rol, '%');

select a.id_rol, a.rol, a.descripcion, nivel,date_format(a.created_on, '%Y-%m-%d %T') as created_on,
    (select count(*) from fact_roles_usuarios aa where a.id_rol = aa.id_rol) as cuenta, b.sede
from fact_roles a
    left join dim_sede b on a.id_sede = b.id_sede
where a.rol like @prol collate utf8mb4_unicode_ci
and (@id_sede = '' or b.id_sede = @id_sede)
order by a.nivel desc;

