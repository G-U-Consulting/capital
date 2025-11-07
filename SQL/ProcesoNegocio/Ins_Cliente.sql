-- =============================================
-- Proceso: Medios/Ins_Archivos
-- =============================================
--START_PARAM
set @nombres = '',
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
    @fechaNacimiento = '';
--END_PARAM


if (@is_atencion_rapida = 1) then
insert into
    fact_clientes (
        nombres,
        email1,
        numero_documento,
        is_atencion_rapida
    )
values (
        @nombres,
        @email1,
        @numeroDocumento,
        1
    )
on duplicate key update
    numero_documento = values(numero_documento),
    is_atencion_rapida = values(is_atencion_rapida);

    select concat('OK-id_cliente:', last_insert_id(), ' ', 'Insert atención rápida') as result;

else

    if exists (
        select 1
        from fact_clientes
        where numero_documento = @numeroDocumento
    ) then
        update fact_clientes
        set nombres = @nombres,
            apellido1 = @apellido1,
            apellido2 = @apellido2,
            direccion = @direccion,
            ciudad = @ciudad,
            barrio = @barrio,
            departamento = @departamento,
            pais = @pais,
            email1 = @email1,
            email2 = @email2,
            telefono1 = @telefono1,
            telefono2 = @telefono2,
            tipo_documento = @tipoDocumento,
            pais_expedicion = @paisExpedicion,
            departamento_expedicion = @departamentoExpedicion,
            ciudad_expedicion = @ciudadExpedicion,
            fecha_expedicion = @fechaExpedicion,
            is_politica_aceptada = @isPoliticaAceptada,
            is_atencion_rapida = @is_atencion_rapida,
            is_titular = @is_titular,
            nombre_empresa = @nombreEmpresa,
            nit = @nit,
            fecha_nacimiento = @fechaNacimiento
        where numero_documento = @numeroDocumento;

        select concat('OK-Registro actualizado:', @numeroDocumento, ' ', 'Update') as result;
    else
        insert into fact_clientes (
            nombres,
            apellido1,
            apellido2,
            direccion,
            ciudad,
            barrio,
            departamento,
            pais,
            email1,
            email2,
            telefono1,
            telefono2,
            tipo_documento,
            numero_documento,
            pais_expedicion,
            departamento_expedicion,
            ciudad_expedicion,
            fecha_expedicion,
            is_politica_aceptada,
            is_atencion_rapida,
            is_titular,
            nombre_empresa,
            nit,
            fecha_nacimiento
        ) values (
            @nombres,
            @apellido1,
            @apellido2,
            @direccion,
            @ciudad,
            @barrio,
            @departamento,
            @pais,
            @email1,
            @email2,
            @telefono1,
            @telefono2,
            @tipoDocumento,
            @numeroDocumento,
            @paisExpedicion,
            @departamentoExpedicion,
            @ciudadExpedicion,
            @fechaExpedicion,
            @isPoliticaAceptada,
            @is_atencion_rapida,
            @is_titular,
            @nombreEmpresa,
            @nit,
            @fechaNacimiento
        );

        select concat('OK-id_cliente:', last_insert_id(), ' ', 'Insert') as result;
    end if;

end if;
