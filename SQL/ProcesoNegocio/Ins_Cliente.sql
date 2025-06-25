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
    @isPoliticaAceptada = 0;
--END_PARAM

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
        is_politica_aceptada = @isPoliticaAceptada
    where Numero_Documento = @numeroDocumento;

    select concat('OK-Registro actualizado:', @numeroDocumento, ' ', 'Update' ) as result;
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
        is_politica_aceptada
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
        @isPoliticaAceptada
    );

    select concat('OK-id_archivo:', last_insert_id(), ' ', 'Insert') as result;
end if;
