-- =============================================
-- Proceso: Proyecto/Get_Salas
-- =============================================
--START_PARAM
set @id_proyecto = NULL;
--END_PARAM

select sv.id_sala_venta, sv.sala_venta, s.id_sede, s.sede, z.id_zona_proyecto, z.zona_proyecto, c.id_ciudadela, c.ciudadela, sp.opcionar
from dim_sala_venta sv
join dim_sala_proyecto sp on sv.id_sala_venta = sp.id_sala_venta
left join dim_sede s on sv.id_sede = s.id_sede
left join dim_zona_proyecto z on sv.id_zona_proyecto = z.id_zona_proyecto
left join dim_ciudadela c on sv.id_ciudadela = c.id_ciudadela
where sp.id_proyecto = @id_proyecto and sp.visualizar = 1 and sv.is_active = 1;
