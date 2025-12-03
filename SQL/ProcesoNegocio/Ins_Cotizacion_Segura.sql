-- =============================================
-- Proceso: ProcesoNegocio/Ins_Cotizacion_Segura
-- =============================================
--START_PARAM
set @id_cliente = 0,
    @fecha = '',
    @descripcion = '',
    @importeTotal = 0,
    @usuario = '',
    @id_proyecto = 0;
--END_PARAM

set @temp_uuid = uuid();

insert into fact_cotizaciones (
    id_cliente,
    fecha,
    descripcion,
    cotizacion,
    importe,
    id_proyecto,
    created_by
)
values (
    @id_cliente,
    now(),
    @descripcion,
    @temp_uuid,
    @importeTotal,
    @id_proyecto,
    @usuario
);

set @inserted = last_insert_id();

select coalesce(max(cast(cotizacion as unsigned)), 0) + 1 into @siguiente_cotizacion
from fact_cotizaciones
where id_cliente = @id_cliente
  and id_proyecto = @id_proyecto
  and cotizacion regexp '^[0-9]+$';

update fact_cotizaciones
set cotizacion = @siguiente_cotizacion
where id_cotizacion = @inserted;

select
    @inserted as id_cotizacion,
    @siguiente_cotizacion as cotizacion;
