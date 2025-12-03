-- =============================================
-- Proceso: ProcesoNegocio/Del_Borrador_Opcion
-- =============================================
--START_PARAM
set @id_opcion = null,
    @id_cotizacion = '1',
    @id_cliente = '2',
    @id_proyecto = '3';
--END_PARAM

delete from fact_borrador_opcion
where id_cotizacion = @id_cotizacion
  and id_cliente = @id_cliente
  and id_proyecto = @id_proyecto
  and (
    (@id_opcion is null and id_opcion is null) OR
    (@id_opcion is not null and id_opcion = @id_opcion)
  );

select
    ROW_COUNT() as filas_eliminadas,
    'Borrador eliminado exitosamente' as mensaje;
