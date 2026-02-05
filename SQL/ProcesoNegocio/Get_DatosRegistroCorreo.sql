-- =============================================
-- Proceso: ProcesoNegocio/Get_DatosRegistroCorreo
-- =============================================
--START_PARAM
set @id_negocios_unidades = 162;
--END_PARAM

select
    p.nombre as proyecto,
    date_format(nu.created_on, '%d/%m/%Y %H:%i') as fecha_visita,
    coalesce(us.nombres, '') as nombre_asesor,
    coalesce(us.email, '') as email_asesor,
    '' as telefono_asesor,
    coalesce(sv.sala_venta, '') as sala_venta,
    '' as direccion_sala,
    (select fd.llave from fact_documento_proyecto fdp
     join fact_documentos fd on fdp.id_documento = fd.id_documento
     where fdp.id_proyecto = p.id_proyecto and fdp.tipo = 'logo' and fdp.is_active = 1
     limit 1) as logo_proyecto_llave,
    s.sede,
    concat(coalesce(p.email_receptor_1, ''), ',', coalesce(p.email_receptor_2, ''), ',', 
     coalesce(p.email_receptor_3, ''), ',', coalesce(p.email_receptor_4, '')) as emails_receptores
from fact_negocios_unidades nu
join fact_cotizaciones co on nu.id_cotizacion = co.id_cotizacion
join fact_proyectos p on co.id_proyecto = p.id_proyecto
left join fact_usuarios us on co.created_by = us.usuario collate utf8mb4_general_ci
left join dim_sala_venta sv on co.id_sala_venta = sv.id_sala_venta -- fact_cotizaciones no tiene id_sala_venta
left join dim_sede s on p.id_sede = s.id_sede
where nu.id_negocios_unidades = @id_negocios_unidades
limit 1;

select
    c.id_cliente,
    concat(coalesce(c.nombres, ''), ' ', coalesce(c.apellido1, ''), ' ', coalesce(c.apellido2, '')) as nombre_cliente,
    c.tipo_documento,
    c.numero_documento,
    coalesce(c.telefono1, c.telefono2) as telefono,
    coalesce(c.email1, c.email2) as email
from fact_negocios_unidades nu
join fact_cotizaciones co on nu.id_cotizacion = co.id_cotizacion
join fact_clientes c on co.id_cliente = c.id_cliente
where nu.id_negocios_unidades = @id_negocios_unidades;
