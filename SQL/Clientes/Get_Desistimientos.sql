-- =============================================
-- Proceso: Clientes/Get_Desistimientos
-- =============================================
--START_PARAM

--END_PARAM

select id_categoria, categoria
from dim_categoria_desistimiento;

select id_penalidad, penalidad, campo
from dim_penalidad_desistimiento;

select id_fiduciaria, fiduciaria
from dim_fiduciaria
where is_active = 1;