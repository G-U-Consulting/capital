-- =============================================
-- Proceso: Clientes/Get_Cuentas
-- =============================================
--START_PARAM
set @id_venta = 15;
--END_PARAM

select co.*, c.numero_documento, c.nombres, c.apellido1, c.apellido2,
    concat(coalesce(c.nombres, ''), ' ', coalesce(c.apellido1, ''), ' ', coalesce(c.apellido2, '')) as nombre_cliente
from dim_cuenta_opcion co
join fact_ventas v on co.id_opcion = v.id_opcion
join fact_clientes c on co.id_cliente = c.id_cliente
where v.id_venta = @id_venta;

select c.id_cliente, c.nombres, c.apellido1, c.apellido2, c.numero_documento,
    concat(coalesce(c.nombres, ''), ' ', coalesce(c.apellido1, ''), ' ', coalesce(c.apellido2, '')) as nombre_cliente,
    coalesce(telefono1, telefono2) as telefono, coalesce(email1, email2) as email, tipo_documento
from fact_ventas v
join fact_opcion o on v.id_opcion = o.id_opcion
join fact_cotizacion_cliente cc on o.id_cotizacion = cc.id_cotizacion
join fact_clientes c on cc.id_cliente = c.id_cliente
where v.id_venta = @id_venta;