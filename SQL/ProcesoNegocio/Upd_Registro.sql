-- =============================================
-- Proceso: ProcesoNegocio/Upd_Registro
-- =============================================
--START_PARAM
set @id_visita = '',
    @id_categoria = '',
    @id_medio = '',
    @id_motivo_compra = '',
    @id_referencia = '',
    @otro_texto = '',
    @descripcion = '',
    @id_presupuesto_vivienda = '',
    @id_tipo_tramite = '',
    @id_modo_atencion = NULL,
    @id_tipo_registro = NULL,
    @usuario = '';
--END_PARAM

set @fecha_registro = (select DATE(created_on) from fact_visitas where id_visita = @id_visita);
set @fecha_hoy = CURDATE();

if @fecha_registro = @fecha_hoy then
    update fact_visitas
    set id_categoria_medio = @id_categoria,
        id_medio = @id_medio,
        id_motivo_compra = @id_motivo_compra,
        id_referencia = @id_referencia,
        otro_texto = @otro_texto,
        descripcion = @descripcion,
        id_presupuesto_vivienda = @id_presupuesto_vivienda,
        id_tipo_tramite = @id_tipo_tramite,
        id_modo_atencion = @id_modo_atencion,
        id_tipo_registro = @id_tipo_registro
    where id_visita = @id_visita;

    select 'OK' as result;
else
    select 'ERROR: Solo se pueden editar registros del día actual' as result;
end if;
