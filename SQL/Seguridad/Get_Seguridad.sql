-- =============================================
-- Proceso: Usuarios/Get_Seguridad
-- =============================================
--START_PARAM
--END_PARAM


select a.valor
from dim_variables_globales a
where a.nombre_variable = 'Js_Seguridad';