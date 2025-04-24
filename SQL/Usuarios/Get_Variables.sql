-- =============================================
-- Proceso: /
-- =============================================
--START_PARAM
--END_PARAM

select a.id_cargo, a.cargo , a.descripcion
from dim_cargo a
where a.is_active = 1;


select a.id_tipo_usuario, a.tipo_usuario
from dim_tipo_usuario a
where a.is_active = 1;