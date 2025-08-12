-- =============================================
-- Proceso: ProcesoNegocio/Ins_Unidades
-- =============================================
--START_PARAM
set @id_cliente = '',
    @id_proyecto = 0,
    @id_unidad = 0,
    @Usuario = '',
    @id_cotizacion = 0;

--END_PARAM


insert into fact_negocios_unidades (id_unidad, id_proyecto, usuario, id_cliente, id_cotizacion)
    values (@id_unidad, @id_proyecto, @Usuario, @id_cliente, @id_cotizacion);

    select concat('OK-id_archivo:', last_insert_id(), ' ', 'Insert') as result;
        