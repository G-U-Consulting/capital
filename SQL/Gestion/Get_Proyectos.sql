-- =============================================
-- Proceso: Gestion/Get_Proyectos
-- =============================================
--START_PARAM
--END_PARAM


select p.id_proyecto, p.nombre, s.sede, z.zona_proyecto, c.ciudadela
from fact_proyectos p
left join dim_sede s on p.id_sede = s.id_sede
left join dim_zona_proyecto z on p.id_zona_proyecto = z.id_zona_proyecto
left join dim_ciudadela c on p.id_ciudadela = c.id_ciudadela
where p.is_active = 1
order by p.nombre;
