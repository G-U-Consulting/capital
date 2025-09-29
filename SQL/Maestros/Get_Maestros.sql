-- =============================================
-- Proceso: General/Get_Maestros
-- =============================================
--START_PARAM

--END_PARAM

select id_grupo_img, orden, grupo, is_active
from dim_grupo_img
order by orden;

select id_categoria, categoria, is_active
from dim_categoria_medio
order by categoria;

select mp.id_medio, mp.medio, mp.id_categoria, mp.is_active, id_sinco, id_sinco as 'ID Sinco', cm.categoria
from dim_medio_publicitario mp 
join dim_categoria_medio cm on mp.id_categoria = cm.id_categoria
order by is_active desc, mp.medio asc;

select id_banco, banco, is_active
from dim_banco_constructor
order by banco;

select id_fiduciaria, fiduciaria, is_active
from dim_fiduciaria
order by fiduciaria;

select zp.id_zona_proyecto, zp.zona_proyecto, zp.is_active, s.id_sede, s.sede
from dim_zona_proyecto zp left join dim_sede s
on zp.id_sede = s.id_sede
order by zp.zona_proyecto;

select c.id_ciudadela, c.ciudadela, c.is_active, s.id_sede, s.sede, z.id_zona_proyecto, z.zona_proyecto
from dim_ciudadela c left join dim_sede s
on c.id_sede = s.id_sede left join dim_zona_proyecto z
on c.id_zona_proyecto = z.id_zona_proyecto
order by c.ciudadela;

select id_instructivo, instructivo, procedimiento, documentacion_cierre, notas, is_active
from dim_instructivo
order by instructivo;

select id_pie_legal, pie_legal, texto, notas_extra, is_active
from dim_pie_legal
order by pie_legal;

select id_tramite, tramite, texto, is_active
from dim_tramite
order by tramite;

select id_documento, documento, is_img, is_active
from dim_documento dd
where documento not like '[Docs] %'
order by documento;

select id_subsidio, periodo, smmlv, smmlv_0_2, smmlv_2_4, imagen, is_active
from dim_subsidio_vis
order by periodo;

select id_tipo_financiacion, tipo_financiacion, is_active
from dim_tipo_financiacion
order by tipo_financiacion;

select id_tipo_proyecto, tipo_proyecto, codigo, is_active
from dim_tipo_proyecto
order by tipo_proyecto;

select id_estado_publicacion, estado_publicacion, is_active
from dim_estado_publicacion
order by estado_publicacion;

select id_tipo_vis, tipo_vis, is_active
from dim_tipo_vis
order by tipo_vis;

select id_email, email 
from dim_email_receptor 
where is_active = 1
order by id_email;

select id_estado_unidad, estado_unidad, estado_unidad_plural, color_fondo, color_fuente, is_active
from dim_estado_unidad
order by estado_unidad;

select s.id_sede, s.sede, s.id_gerente, s.alias, s.is_active, u.nombres as gerencia
from dim_sede s
join fact_usuarios u on s.id_gerente = u.id_usuario
order by sede;

select id_factor, factor, unidad from dim_factor order by id_factor;
select id_tipo_factor, tipo_factor from dim_tipo_factor;

select id_banco, id_factor, id_tipo_factor, valor from dim_banco_factor where id_proyecto is NULL;

select id_caja, caja, is_active
from dim_caja_compensacion
order by caja;

select id_tipo_tramite, tipo_tramite, is_active
from dim_tipo_tramite;

select id_tipo_registro, tipo_registro, is_active
from dim_tipo_registro;

select u.id_usuario, u.nombres
from fact_usuarios u
join fact_roles_usuarios ru on u.id_usuario = ru.id_usuario
where u.is_active = 1 and (ru.id_rol = 6 or ru.id_rol = 28)
order by nombres;