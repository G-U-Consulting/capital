-- =============================================
-- Proceso: Medios/Ins_Archivos
-- =============================================
--START_PARAM
set 
    @id_cliente = '',
    @nombres = '',
    @apellido1 = '',
    @apellido2 = '',
    @direccion = '',
    @ciudad = '',
    @barrio = '',
    @departamento = '',
    @pais = '',
    @email1 = '',
    @email2 = '',
    @telefono1 = '',
    @telefono2 = '',
    @tipoDocumento = '',
    @numeroDocumento = '',
    @paisExpedicion = '',
    @departamentoExpedicion = '',
    @ciudadExpedicion = '',
    @fechaExpedicion = '',
    @isPoliticaAceptada = 0,
    @is_atencion_rapida = 0,
    @is_titular = 0,
    @nombreEmpresa = '',
    @nit = '',
    @fechaNacimiento = '',
    @porcentaje_copropiedad = 0,
    @pais_tel1 = NULL,
    @codigo_tel1 = NULL,
    @pais_tel2 = NULL,
    @codigo_tel2 = NULL;
--END_PARAM

if (@is_atencion_rapida = 1) then
    set @old_id = 0;

    select id_cliente into @old_id
    from fact_clientes
    where numero_documento = @numeroDocumento
       or email1 = @email1
    limit 1;

    insert into fact_clientes (
        nombres, email1, numero_documento, is_atencion_rapida
    ) values (
        @nombres, @email1, @numeroDocumento, 1
    )
    on duplicate key update
        nombres = values(nombres),
        email1 = values(email1),
        numero_documento = values(numero_documento),
        is_atencion_rapida = 1,
        id_cliente = last_insert_id(id_cliente);

    if @old_id = 0 then 
        set @accion = 'insert';
    else
        set @accion = 'update';
    end if;

    select concat('ok-id_cliente:', last_insert_id(), ' ', @accion) as result;

else
    set @old_id = 0;

    select id_cliente into @old_id
    from fact_clientes
    where numero_documento = @numeroDocumento
       or email1 = @email1
    limit 1;

    insert into fact_clientes (
        nombres, apellido1, apellido2, direccion, ciudad, barrio, departamento,
        pais, email1, email2, telefono1, telefono2, tipo_documento, numero_documento,
        pais_expedicion, departamento_expedicion, ciudad_expedicion, fecha_expedicion,
        is_politica_aceptada, is_atencion_rapida, is_titular, nombre_empresa, nit,
        fecha_nacimiento, porcentaje_copropiedad, pais_tel1, codigo_tel1, pais_tel2, codigo_tel2
    ) values (
        @nombres, @apellido1, @apellido2, @direccion, @ciudad, @barrio, @departamento,
        @pais, @email1, @email2, @telefono1, @telefono2, @tipoDocumento, @numeroDocumento,
        @paisExpedicion, @departamentoExpedicion, @ciudadExpedicion, if(@fechaExpedicion = '', null, @fechaExpedicion),
        @isPoliticaAceptada, @is_atencion_rapida, @is_titular, @nombreEmpresa, @nit,
        if(@fechaNacimiento = '', null, @fechaNacimiento), @porcentaje_copropiedad, @pais_tel1, @codigo_tel1, @pais_tel2, @codigo_tel2
    )
    on duplicate key update
        nombres = values(nombres),
        apellido1 = values(apellido1),
        apellido2 = values(apellido2),
        direccion = values(direccion),
        ciudad = values(ciudad),
        barrio = values(barrio),
        departamento = values(departamento),
        pais = values(pais),
        email1 = values(email1),
        email2 = values(email2),
        telefono1 = values(telefono1),
        telefono2 = values(telefono2),
        tipo_documento = values(tipo_documento),
        pais_expedicion = values(pais_expedicion),
        departamento_expedicion = values(departamento_expedicion),
        ciudad_expedicion = values(ciudad_expedicion),
        fecha_expedicion = values(fecha_expedicion),
        is_politica_aceptada = values(is_politica_aceptada),
        is_atencion_rapida = values(is_atencion_rapida),
        is_titular = values(is_titular),
        nombre_empresa = values(nombre_empresa),
        nit = values(nit),
        fecha_nacimiento = values(fecha_nacimiento),
        porcentaje_copropiedad = values(porcentaje_copropiedad),
        pais_tel1 = values(pais_tel1),
        codigo_tel1 = values(codigo_tel1),
        pais_tel2 = values(pais_tel2),
        codigo_tel2 = values(codigo_tel2),
        id_cliente = last_insert_id(id_cliente);

    if @old_id = 0 then 
        set @accion = 'Insert';
    else
        set @accion = 'Update';
    end if;

    select concat('OK-id_cliente:', last_insert_id(), ' ', @accion) as result;

end if;