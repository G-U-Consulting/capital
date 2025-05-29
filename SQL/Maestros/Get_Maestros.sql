-- =============================================
-- Proceso: General/Get_Maestros
-- =============================================
--START_PARAM

--END_PARAM

select id_grupo_img, orden, grupo
from dim_grupo_img
order by orden;

select id_categoria, categoria, is_active
from dim_categoria_medio
order by categoria;

select mp.id_medio, mp.medio, mp.id_categoria, mp.is_active, id_sinco, id_sinco as 'ID Sinco', 
cm.categoria, if(mp.is_active = 1, 'Sí', 'No') as 'Activo'
from dim_medio_publicitario mp 
join dim_categoria_medio cm on mp.id_categoria = cm.id_categoria
order by is_active desc, mp.medio asc;

select id_banco, banco
from dim_banco_constructor
order by banco;

select id_fiduciaria, fiduciaria
from dim_fiduciaria
where is_active = 1
order by fiduciaria;

select id_zona_proyecto, zona_proyecto
from dim_zona_proyecto
order by zona_proyecto;

select id_ciudadela, ciudadela
from dim_ciudadela 
where is_active = 1
order by ciudadela;

select id_instructivo, instructivo, procedimiento, documentacion_cierre, notas
from dim_instructivo
order by instructivo;

select id_pie_legal, pie_legal, texto, notas_extra
from dim_pie_legal
where is_active = 1
order by pie_legal;

select id_tramite, tramite, texto
from dim_tramite
where is_active = 1
order by tramite;

select id_documento, documento, is_img
from dim_documento dd
where is_active = 1 and documento not like '[Docs] %'
order by documento;

select id_subsidio, periodo, smmlv, smmlv_0_2, smmlv_2_4, imagen
from dim_subsidio_vis
order by periodo;

select id_tipo_financiacion, tipo_financiacion 
from dim_tipo_financiacion
order by tipo_financiacion;

select id_tipo_proyecto, tipo_proyecto
from dim_tipo_proyecto
order by tipo_proyecto;

select id_estado_publicacion, estado_publicacion 
from dim_estado_publicacion
order by estado_publicacion;

select id_tipo_vis, tipo_vis
from dim_tipo_vis
order by tipo_vis;

select id_email, email 
from dim_email_receptor 
where is_active = 1
order by id_email;

select id_factor, factor from dim_factor;
select id_tipo_factor, tipo_factor from dim_tipo_factor;

select id_banco, id_factor, id_tipo_factor, valor from dim_banco_factor;