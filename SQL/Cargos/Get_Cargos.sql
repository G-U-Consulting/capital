-- =============================================
-- Proceso: Usuarios/Get_Cargos
-- =============================================
--START_PARAM
set @cargo = '';
--END_PARAM

set @pcargo = concat('%', @cargo, '%');

select a.id_cargo, a.cargo, a.descripcion, date_format(a.created_on, '%Y-%m-%d %T') as created_on
from dim_cargo a
where a.cargo like @pcargo collate utf8mb4_unicode_ci
    or a.cargo like @pcargo collate utf8mb4_unicode_ci;