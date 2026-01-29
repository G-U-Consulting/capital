-- =============================================
-- Proceso: Clientes/Get_ListasEsperas
-- =============================================
--START_PARAM

--END_PARAM

select date_format(l.created_on, '%Y-%m-%d') as created_on, l.*, coalesce(c.email1, email2) as email, tu.tipo,
    coalesce(c.telefono1, c.telefono2) as telefono, c.numero_documento, t.consecutivo as torre, tp.tipo_proyecto as clase,
    concat(coalesce(c.nombres, ''), ' ', coalesce(c.apellido1, ''), ' ', coalesce(c.apellido2, '')) as nombre_cliente,
    c.nombres, c.apellido1, c.apellido2, u.nombres as nombre_asesor, p.nombre as proyecto, un.nombre_unidad, s.sede, 
    d.llave as logo_proyecto_img
from fact_lista_espera l
join fact_clientes c on l.id_cliente = c.id_cliente
join fact_proyectos p on l.id_proyecto = p.id_proyecto
join fact_usuarios u on l.id_usuario = u.id_usuario
left join fact_torres t on l.id_torre = t.id_torre
left join fact_unidades un on l.id_unidad = un.id_unidad
left join dim_tipo_proyecto tp on l.id_clase = tp.id_tipo_proyecto
left join dim_tipo_unidad tu on l.id_tipo = tu.id_tipo
left join dim_sede s on p.id_sede = s.id_sede
left join fact_documento_proyecto dp on p.id_proyecto = dp.id_proyecto and dp.tipo = 'logo' and dp.is_active = 1
left join fact_documentos d on dp.id_documento = d.id_documento
order by created_on;

select id_proyecto, nombre
from fact_proyectos
where is_active = 1;

select id_usuario, usuario, nombres
from fact_usuarios
where is_active = 1;