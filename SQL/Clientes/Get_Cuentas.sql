-- =============================================
-- Proceso: Clientes/Get_Cuentas
-- =============================================
--START_PARAM
set @id_desistimiento = NULL;
--END_PARAM

select * 
from dim_cuenta_desistimiento
where id_desistimiento = @id_desistimiento;

select c.id_cliente, c.nombres, c.apellido1, c.apellido2, c.numero_documento,
    concat(coalesce(c.nombres, ''), ' ', coalesce(c.apellido1, ''), ' ', coalesce(c.apellido2, '')) as nombre_cliente,
    coalesce(telefono1, telefono2) as telefono, coalesce(email1, email2) as email, tipo_documento
from dim_desistimiento d
join dim_venta_cliente vc on d.id_venta = vc.id_venta
join fact_clientes c on vc.id_cliente = c.id_cliente
where d.id_desistimiento = @id_desistimiento;