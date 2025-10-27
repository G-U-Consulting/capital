-- =============================================
-- Proceso: ProcesoNegocio/Ins_Unidades
-- =============================================
--START_PARAM
set @id_cliente = '2',
    @id_proyecto = '3',
    @usuario = 'alejandros',
    @unidad = '410',
    @cotizacion = '1',
    @id_cotizacion = '1',
    @inv_terminado = '0',
    @tipo = 'TIPO B',
    @torre = '2',
    @observacion_apto = 'TIPO B+BALCON TIPO - BALCÓN BARANDA',
    @valor_descuento = '0.00',
    @valor_unidad = '249820000,00',
    @valor_acabados = '',
    @valor_reformas = '',
    @valor_separacion = '',
    @lista = '1',
    @id_unidad = '0',
    @numero_apartamento = 'Apto 410',
    @fecha_entrega = '2023-12-31';
--END_PARAM

insert into fact_negocios_unidades (
    id_cliente,
    id_proyecto,
    usuario,
    unidad,
    cotizacion,
    id_cotizacion,
    consecutivo,
    inv_terminado,
    tipo,
    torre,
    observacion_apto,
    valor_descuento,
    valor_unidad,
    valor_acabados,
    valor_reformas,
    lista,
    numero_apartamento,
    id_unidad,
    fecha_entrega,
    valor_separacion
)
select
    @id_cliente,
    @id_proyecto,
    @usuario,
    @unidad,
    @cotizacion,
    @id_cotizacion,
    t.consecutivo,
    @inv_terminado,
    @tipo,
    @torre,
    @observacion_apto,
    @valor_descuento,
    @valor_unidad,
    @valor_acabados,
    @valor_reformas,
    @lista,
    @numero_apartamento,
    @id_unidad,
    @fecha_entrega,
    @valor_separacion
from fact_torres t
where t.consecutivo = convert(@torre using utf8mb4) collate utf8mb4_unicode_ci
limit 1;


select concat('ok-id_archivo:', last_insert_id(), ' ', 'insert') as result;

