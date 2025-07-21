-- =============================================
-- Proceso: Maestros/Get_Salas 
-- =============================================
--START_PARAM

--END_PARAM

select sv.id_sala_venta, sv.sala_venta, sv.encuesta_vpn, s.sede, sv.is_active, sv.id_sede, sv.id_playlist, 
    sv.is_feria, sv.id_zona_proyecto, z.zona_proyecto, sv.id_ciudadela, c.ciudadela, sv.pro_futuros
from dim_sala_venta sv left join dim_sede s
on sv.id_sede = s.id_sede left join dim_zona_proyecto z
on sv.id_zona_proyecto = z.id_zona_proyecto left join dim_ciudadela c
on sv.id_ciudadela = c.id_ciudadela
order by sv.sala_venta;

select id_sede, sede, alias, is_active
from dim_sede
order by sede;

select zp.id_zona_proyecto, zp.zona_proyecto, zp.is_active, s.id_sede, s.sede
from dim_zona_proyecto zp left join dim_sede s
on zp.id_sede = s.id_sede
order by zp.zona_proyecto;

select c.id_ciudadela, c.ciudadela, c.is_active, s.id_sede, s.sede, z.id_zona_proyecto, z.zona_proyecto
from dim_ciudadela c left join dim_sede s
on c.id_sede = s.id_sede left join dim_zona_proyecto z
on c.id_zona_proyecto = z.id_zona_proyecto
order by c.ciudadela;

select id_tipo_turno, tipo_turno from dim_tipo_turno order by id_tipo_turno;

select id_campo, campo from dim_campo_obligatorio order by id_campo;