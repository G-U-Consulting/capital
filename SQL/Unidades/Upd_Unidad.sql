-- =============================================
-- Proceso: Unidades/Upd_Unidad
-- =============================================
--START_PARAM
set @Usuario = NULL,
    @fecha_fec = NULL,
    @fecha_edi = NULL,
    @fecha_edi_mostrar = NULL,
    @id_unidad = NULL,
    @id_proyecto = NULL,
    @id_torre = NULL,
    @id_estado_unidad = NULL,
    @id_tipo = NULL,
    @nombre_unidad = NULL,
    @numero_apartamento = NULL,
    @piso = NULL,
    @localizacion = NULL,
    @observacion_apto = NULL,
    @inv_terminado = NULL,
    @num_alcobas = NULL,
    @num_banos = NULL,
    @area_privada_cub = NULL,
    @area_privada_lib = NULL,
    @area_total = NULL,
    @acue = NULL,
    @area_total_mas_acue = NULL,
    @valor_separacion = NULL,
    @valor_acabados = NULL,
    @valor_reformas = NULL,
    @valor_descuento = NULL,
    @pate = NULL,
    @id_cuenta_convenio = NULL,
    @asoleacion = NULL,
    @altura = NULL,
    @cerca_porteria = NULL,
    @cerca_juegos_infantiles = NULL,
    @cerca_piscina = NULL,
    @tiene_balcon = NULL,
    @tiene_parq_sencillo = NULL,
    @tiene_parq_doble = NULL,
    @tiene_deposito = NULL,
    @tiene_acabados = NULL,
    @cuenta_tipo = NULL,
    @cuenta_numero = NULL,
    @convenio = NULL,
    @cuota_inicial_banco = NULL,
    @ean = NULL,
    @estatus = NULL,
    @idtorre = NULL,
    @apartamento = NULL;
--END_PARAM

set @torreid = NULL,
    @idcuenta = NULL;

select id_torre into @torreid from fact_torres
where id_proyecto = @id_proyecto and nombre_torre = concat('Torre ', @idtorre) and consecutivo = @idtorre;
if @torreid is null then
    insert into fact_torres(id_proyecto, nombre_torre, consecutivo, created_by)
    values(@id_proyecto, concat('Torre ', @idtorre), @idtorre, @Usuario);
    select id_torre into @torreid from fact_torres
    where id_proyecto = @id_proyecto and nombre_torre = concat('Torre ', @idtorre) and consecutivo = @idtorre;
end if;

select id_cuenta_convenio into @idcuenta from dim_cuenta_convenio
where cuenta_tipo = @cuenta_tipo and cuenta_numero = @cuenta_numero and convenio = @convenio 
    and cuota_inicial_banco = @cuota_inicial_banco and ean = @ean;
if @idcuenta is null then
    insert into dim_cuenta_convenio(cuenta_tipo, cuenta_numero, convenio, cuota_inicial_banco, ean, created_by)
    values(@cuenta_tipo, @cuenta_numero, @convenio, @cuota_inicial_banco, @ean, @Usuario);
    select id_cuenta_convenio into @idcuenta from dim_cuenta_convenio
    where cuenta_tipo = @cuenta_tipo and cuenta_numero = @cuenta_numero and convenio = @convenio 
        and cuota_inicial_banco = @cuota_inicial_banco and ean = @ean;
end if;

update fact_unidades 
set fecha_fec = if(@fecha_fec = '', NULL, @fecha_fec), 
    fecha_edi = if(@fecha_edi = '', NULL, @fecha_edi), 
    fecha_edi_mostrar = if(@fecha_edi_mostrar = '', NULL, @fecha_edi_mostrar),
    id_proyecto = @id_proyecto, 
    id_torre = @torreid, 
    id_estado_unidad = @id_estado_unidad,
    nombre_unidad = concat(
        (select coalesce(tp.codigo, '') from dim_tipo_proyecto tp 
            where tp.id_tipo_proyecto = id_clase), ' ', @apartamento),
    numero_apartamento = @apartamento, 
    piso = @piso,
    tipo = (select tu.tipo from dim_tipo_unidad tu where tu.id_tipo = @id_tipo), 
    codigo_planta = (select tu.tipo from dim_tipo_unidad tu where tu.id_tipo = @id_tipo),
    id_tipo = @id_tipo,
    localizacion = @localizacion,
    observacion_apto = @observacion_apto, 
    inv_terminado = convert(@inv_terminado, unsigned),
    num_alcobas = convert(@num_alcobas, int), 
    num_banos = convert(@num_banos, int),
    area_privada_cub = convert(@area_privada_cub, decimal(20, 2)),
    area_privada_lib = convert(@area_privada_lib, decimal(20, 2)),
    area_total = convert(@area_total, decimal(20, 2)), 
    acue = convert(@acue, decimal(20, 2)),
    area_total_mas_acue = convert(@area_total_mas_acue, decimal(20, 2)),
    valor_separacion = convert(@valor_separacion, decimal(20, 2)),
    valor_acabados = convert(@valor_acabados, decimal(20, 2)),
    valor_reformas = convert(@valor_reformas, decimal(20, 2)),
    valor_descuento = convert(@valor_descuento, decimal(20, 2)), 
    pate = @pate,
    id_cuenta_convenio = @idcuenta,
    asoleacion = @asoleacion,
    altura = @altura,
    cerca_porteria = convert(@cerca_porteria, unsigned),
    cerca_juegos_infantiles = convert(@cerca_juegos_infantiles, unsigned),
    cerca_piscina = convert(@cerca_piscina, unsigned),
    tiene_balcon = convert(@tiene_balcon, unsigned),
    tiene_parq_sencillo = convert(@tiene_parq_sencillo, unsigned),
    tiene_parq_doble = convert(@tiene_parq_doble, unsigned),
    tiene_deposito = convert(@tiene_deposito, unsigned),
    tiene_acabados = convert(@tiene_acabados, unsigned),
    updated_by = @Usuario,
    updated_on = current_timestamp
where id_unidad = @id_unidad;

select 'OK' as result;