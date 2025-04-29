-- =============================================
-- Proceso: General/Get_Variable
-- =============================================
--START_PARAM
set @nombre_variable = '';
--END_PARAM

select valor
from dim_variables_globales
where nombre_variable = @nombre_variable;