-- =============================================
-- Proceso: Usuarios/Get_Usuarios
-- =============================================
--START_PARAM
set @usuario = '';
--END_PARAM

set @pusuario = concat('%', @usuario, '%');

select a.id_usuario, a.usuario, a.nombres, date_format(a.created_on, '%Y-%m-%d %T') as created_on
from fact_usuarios a
where a.usuario like @pusuario collate utf8mb4_unicode_ci
    or a.nombres like @pusuario collate utf8mb4_unicode_ci;