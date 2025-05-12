-- =============================================
-- Proceso: General/Get_Maestros
-- =============================================
--START_PARAM

--END_PARAM

select id_grupo_img, orden, grupo
from dim_grupo_img
order by orden;

select id_instructivo, instructivo, procedimiento, documentacion_cierre, notas
from dim_instructivo;

select id_tramite, tramite, texto
from dim_tramite
where is_active = 1;

select id_subsidio, smmlv, smmlv_0_2, smmlv_2_4, imagen
from dim_subsidio_vis;

select id_categoria, categoria
from dim_categoria_medio
where is_active = 1
order by categoria;

select mp.id_medio, mp.medio, mp.id_categoria, mp.is_active, id_sinco, id_sinco as 'ID Sinco', 
cm.categoria, if(mp.is_active = 1, 'Sí', 'No') as 'Activo'
from dim_medio_publicitario mp 
join dim_categoria_medio cm on mp.id_categoria = cm.id_categoria
order by is_active desc;

select id_documento, documento, descripcion
from dim_documento
where is_active = 1
order by documento;

select id_zona_proyecto, zona_proyecto
from dim_zona_proyecto;

select id_ciudadela, ciudadela
from dim_ciudadela 
where is_active = 1;

select id_pie_legal, pie_legal, texto, notas_extra
from dim_pie_legal
where is_active = 1;

select id_fiduciaria, fiduciaria
from dim_fiduciaria
where is_active = 1;

select id_banco, banco
from dim_banco_constructor;

select id_factor, factor from dim_factor;
select id_tipo_factor, tipo_factor from dim_tipo_factor;

select id_banco, id_factor, id_tipo_factor, valor from dim_banco_factor;