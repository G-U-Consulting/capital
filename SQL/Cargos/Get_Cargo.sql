-- =============================================
-- Proceso: Usuarios/Get_Cargo
-- =============================================
--START_PARAM
set @id_cargo = '';
--END_PARAM

select a.id_cargo, a.cargo, a.descripcion
from dim_cargo a
where id_cargo = @id_cargo;