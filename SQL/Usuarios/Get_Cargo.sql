-- =============================================
-- Proceso: Usuarios/Get_Cargo
-- =============================================
--START_PARAM

--END_PARAM

select a.id_cargo, a.cargo
from dim_cargo a
where a.is_active = 1

