-- =============================================
-- Proceso: ProcesoNegocio/Ins_Borrador_Opcion
-- Descripción: Inserta o actualiza un borrador de opción
-- =============================================
--START_PARAM
set @id_opcion = NULL,
    @id_cotizacion = '1',
    @id_cliente = '2',
    @id_proyecto = '3',
    @datos_json = '{"fecha_entrega":"2030-05-17","valor_reformas":"0"}',
    @usuario_creacion = 'alejandros';
--END_PARAM

insert into fact_borrador_opcion (
    id_opcion,
    id_cotizacion,
    id_cliente,
    id_proyecto,
    datos_json,
    usuario_creacion,
    fecha_creacion,
    fecha_modificacion
) values (
    @id_opcion,
    @id_cotizacion,
    @id_cliente,
    @id_proyecto,
    @datos_json,
    @usuario_creacion,
    NOW(),
    NOW()
)
on duplicate key update
    datos_json = @datos_json,
    fecha_modificacion = NOW(),
    usuario_creacion = @usuario_creacion;

select
    LAST_INSERT_ID() as id_borrador,
    'Borrador guardado exitosamente' as mensaje,
    NOW() as fecha_guardado;
