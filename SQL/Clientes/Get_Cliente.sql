-- =============================================
-- Proceso: Clientes/Get_Cliente
-- =============================================
--START_PARAM
set @numero_documento = NULL,
    @email1 = NULL;
--END_PARAM

select c.id_cliente, c.nombres, c.apellido1, c.apellido2, c.email1, c.email2,
    c.telefono1, c.pais_tel1, c.codigo_tel1, c.telefono2, c.pais_tel2, c.codigo_tel2, 
    c.is_vetado, vc.solicitado_por, vc.vetado_por, vc.vigente 
from fact_clientes c
left join dim_veto_cliente vc on c.id_cliente = vc.id_cliente
where numero_documento collate utf8mb4_general_ci = @numero_documento 
    or email1 = @email1 or email2 = @email1 limit 1;