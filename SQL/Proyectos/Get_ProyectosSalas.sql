-- =============================================
-- Proceso: Proyecto/Get_ProyectosSalas
-- =============================================
--START_PARAM
--END_PARAM


select b.id_proyecto, a.id_sala_venta
from dim_sala_venta a
join dim_sala_proyecto b on a.id_sala_venta = b.id_sala_venta
where a.is_active = 1
