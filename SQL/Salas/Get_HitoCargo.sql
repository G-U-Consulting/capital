-- =============================================
-- Proceso: Salas/Get_HitoCargo
-- =============================================
--START_PARAM
set @id_hito = NULL;
--END_PARAM

select hc.id_hito, hc.id_cargo 
from dim_hito_cargo hc join dim_hito_sala h
on hc.id_hito = h.id_hito
where h.id_hito = @id_hito;