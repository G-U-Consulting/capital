-- =============================================
-- Proceso: ProcesoNegocio/Get_DatosVisitaCorreo
-- =============================================
--START_PARAM
set @id_visita = 1;
--END_PARAM

select
    p.nombre as proyecto,
    date_format(v.created_on, '%d/%m/%Y %H:%i') as fecha_visita,
    coalesce(us.nombres, '') as nombre_asesor,
    coalesce(us.email, '') as email_asesor,
    '' as telefono_asesor,
    coalesce(sv.sala_venta, '') as sala_venta,
    '' as direccion_sala,
    (select fd.llave from fact_documento_proyecto fdp
     join fact_documentos fd on fdp.id_documento = fd.id_documento
     where fdp.id_proyecto = p.id_proyecto and fdp.tipo = 'logo' and fdp.is_active = 1
     limit 1) as logo_proyecto_llave
from fact_visitas v
join fact_proyectos p on v.id_proyecto = p.id_proyecto
join fact_usuarios us on v.created_by = us.usuario collate utf8mb4_general_ci
left join dim_sala_venta sv on v.id_sala_venta = sv.id_sala_venta
where v.id_visita = @id_visita
limit 1;

select
    c.id_cliente,
    concat(coalesce(c.nombres, ''), ' ', coalesce(c.apellido1, ''), ' ', coalesce(c.apellido2, '')) as nombre_cliente,
    c.tipo_documento,
    c.numero_documento,
    coalesce(c.telefono1, c.telefono2) as telefono,
    coalesce(c.email1, c.email2) as email
from fact_visitas v
join fact_clientes c on v.id_cliente = c.id_cliente
where v.id_visita = @id_visita;
