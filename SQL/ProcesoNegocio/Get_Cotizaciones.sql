-- =============================================
-- Proceso: ProcesoNegocio/Get_Cotizaciones
-- =============================================
--START_PARAM
set @id_cliente = '2',
    @id_proyecto = '3';
--END_PARAM

select
    a.id_cotizacion,
    a.id_cliente,
    a.cotizacion,
    DATE_FORMAT(a.fecha, '%Y-%m-%d %H:%i:%s') as fecha,
    a.descripcion,
    a.importe,
    b.nombre,
    case
        when exists (
            select 1
            from fact_opcion o
            where o.id_cotizacion = a.id_cotizacion
        ) then 'Opcionada'
        when exists (
            select 1
            from fact_borrador_opcion br
            where br.id_cotizacion = a.id_cotizacion
              and br.id_cliente = a.id_cliente
              and br.id_proyecto = a.id_proyecto
        ) then 'Borrador'
        else 'Pendiente'
    end as status
from fact_cotizaciones a
left join fact_proyectos b on a.id_proyecto = b.id_proyecto
where
    a.id_cliente = @id_cliente
    and a.id_proyecto = @id_proyecto;





