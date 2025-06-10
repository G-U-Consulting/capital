-- =============================================
-- Proceso: ProcesoNegocio/Get_variables
-- =============================================
--START_PARAM
--END_PARAM

select id_categoria, categoria
from dim_categoria_medio
where is_active = 1;

select id_medio, medio
from dim_medio_publicitario
where is_active = 1;