-- =============================================
-- Proceso: Clientes/Get_Clientes
-- =============================================
--START_PARAM

--END_PARAM

select c.*, concat(coalesce(nombres, ''), ' ', coalesce(apellido1, ''), ' ', coalesce(apellido2, '')) as nombre,
    date_format(vc.fecha, '%Y-%m-%d %T') as fecha_veto, vc.motivo as motivo_veto,
    (select u.nombres from fact_usuarios u where u.usuario collate utf8mb4_general_ci = vc.solicitado_por) as veto_solicitado_por,
    (select u.nombres from fact_usuarios u where u.usuario collate utf8mb4_general_ci = vc.vetado_por) as vetado_por
from fact_clientes c
left join dim_veto_cliente vc on c.id_cliente = vc.id_cliente
order by c.numero_documento is null or c.numero_documento = '', c.numero_documento;