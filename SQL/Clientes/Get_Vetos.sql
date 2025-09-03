-- =============================================
-- Proceso: Clientes/Get_Vetos
-- =============================================
--START_PARAM

--END_PARAM

select id_veto, date_format(vc.fecha, '%d/%m/%Y %T') as fecha, vc.motivo, vc.vigente,
    coalesce(email1, email2) as email, coalesce(telefono1, telefono2) as telefono,
    concat(coalesce(c.nombres, ''), ' ', coalesce(c.apellido1, ''), ' ', coalesce(c.apellido2, '')) as nombre,
    c.numero_documento, us.nombres as solicitado_por, uv.nombres as vetado_por
from dim_veto_cliente vc 
join fact_clientes c on vc.id_cliente = c.id_cliente
join fact_usuarios us on vc.solicitado_por = us.usuario collate utf8mb4_general_ci
left join fact_usuarios uv on vc.vetado_por = uv.usuario collate utf8mb4_general_ci;