-- =============================================
-- Proceso: Gestion/Get_Torres
-- =============================================
--START_PARAM
set @id_proyecto = NULL;
--END_PARAM

select t.id_torre, t.consecutivo, t.id_sinco, f.fiduciaria, t.en_venta
from fact_torres t
left join dim_fiduciaria f on t.id_fiduciaria = f.id_fiduciaria
where t.is_active = 1 and t.id_proyecto = @id_proyecto
order by t.consecutivo;
