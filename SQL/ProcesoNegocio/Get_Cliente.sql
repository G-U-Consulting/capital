-- =============================================
-- Proceso: ProcesoNegocio/Get_Cliente
-- =============================================
--START_PARAM

set @cliente = '';
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
       date_format(a.fecha_expedicion, '%Y-%m-%d') as fecha_expedicion
from fact_clientes a
where a.is_active = 1
  and @cliente != ''
  and (
    a.nombres like concat('%', @cliente collate utf8mb4_general_ci, '%')
    or a.numero_documento like concat('%', @cliente collate utf8mb4_general_ci, '%')
  )
order by 1;