-- =============================================
-- Proceso: Clientes/Get_Clientes
-- =============================================
--START_PARAM

--END_PARAM

select *, concat(coalesce(nombres, ''), ' ', coalesce(apellido1, ''), ' ', coalesce(apellido2, '')) as nombre 
from fact_clientes;