-- =============================================
-- Proceso: ProcesoNegocio/Get_Cotizacion_Cliente
-- =============================================
--START_PARAM
set @id_cotizacion = '312';
--END_PARAM

select a.id_cliente,
    a.nombres,
    a.apellido1,
    a.apellido2,
    a.direccion,
    a.ciudad,
    a.barrio,
    a.departamento,
    a.pais,
    a.email1,
    a.email2,
    a.telefono1,
    a.telefono2,
    a.tipo_documento,
    a.numero_documento,
    a.pais_expedicion,
    a.departamento_expedicion,
    a.ciudad_expedicion,
    a.is_politica_aceptada,
    a.is_vetado,
    DATE_FORMAT(a.fecha_expedicion, '%Y-%m-%d') as fecha_expedicion,
    DATE_FORMAT(a.fecha_nacimiento, '%Y-%m-%d') as fecha_nacimiento,
    a.nit,
    a.is_titular,
    a.nombre_empresa,
    IFNULL(b.porcentaje_copropiedad, 0) as porcentaje_copropiedad
from fact_cotizacion_cliente b
 join fact_clientes a on a.id_cliente = b.id_cliente
where b.id_cotizacion = @id_cotizacion;
