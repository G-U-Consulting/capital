-- =============================================
-- Proceso: ProcesoNegocio/Get_Cliente
-- =============================================
--START_PARAM
set @cliente = '222222';
--END_PARAM

select 
    a.id_cliente,
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
    a.pais_tel1,
    a.codigo_tel1,
    a.telefono2,
    a.pais_tel2,
    a.codigo_tel2,
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
    a.porcentaje_copropiedad,
    a.observaciones
from fact_clientes a
where a.is_active = 1
  and @cliente != ''
  and (
    a.numero_documento COLLATE utf8mb4_unicode_ci = @cliente COLLATE utf8mb4_unicode_ci
  )
order by a.id_cliente;
