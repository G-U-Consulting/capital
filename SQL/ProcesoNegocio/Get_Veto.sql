-- =============================================
-- Proceso: ProcesoNegocio/Get_Veto
-- =============================================
--START_PARAM

set @id_cliente = '';
--END_PARAM

select fecha , motivo, vetado_por
from dim_veto_cliente
where id_cliente = @id_cliente