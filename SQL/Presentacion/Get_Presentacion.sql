-- =============================================
-- Proceso: Usuarios/Get_Presentacion
-- =============================================
--START_PARAM
--END_PARAM


select a.valor
from dim_variables_globales a
where a.nombre_variable = 'CarDurac';