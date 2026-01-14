-- =============================================
-- Proceso: ProcesoNegocio/Get_Unidades_Opcionadas_Cliente
-- =============================================
--START_PARAM
set @id_cliente = '2',
    @id_proyecto = '3';
--END_PARAM

select
    DATE_FORMAT(o.created_on, '%Y-%m-%d') as fecha,
    p.nombre as proyecto,
    ifnull(nu.tipo, 'N/A') as tipo,
    case
        when o.pago_contado = 1 then 'Contado'
        when o.pago_financiado = 1 then 'Financiado'
        else 'N/A'
    end as modo,
    concat(
        'Torre: ', ifnull(nu.torre, 'N/A'),
        ' - Unidad: ', ifnull(nu.numero_apartamento, 'N/A'),
        ' - Valor: $', format(ifnull(nu.valor_unidad, 0), 0)
    ) as descripcion,
    o.id_opcion,
    c.id_cotizacion,
    c.cotizacion,
    nu.id_unidad,
    c.id_cliente
from fact_opcion o
join fact_cotizaciones c on o.id_cotizacion = c.id_cotizacion
left join fact_negocios_unidades nu on c.id_cotizacion = nu.id_cotizacion
join fact_proyectos p on c.id_proyecto = p.id_proyecto
where c.id_cliente = @id_cliente
  and c.id_proyecto = @id_proyecto
  and c.is_active = 1
order by o.created_on desc;
