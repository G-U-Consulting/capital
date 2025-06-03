-- =============================================
-- Proceso: Medios/Ins_Archivos
-- =============================================
--START_PARAM
set @NewNombres = '',
    @NewApellido1 = '',
    @NewApellido2 = '',
    @NewDireccion = '',
    @NewCiudad = '',
    @NewBarrio = '',
    @NewDepartamento = '',
    @NewPais = '',
    @NewEmail1 = '',
    @NewEmail2 = '',
    @NewTelefono1 = '',
    @NewTelefono2 = '',
    @NewTipoDocumento = '',
    @NewNumeroDocumento = '',
    @NewPaisExpedicion = '',
    @NewDepartamentoExpedicion = '',
    @NewCiudadExpedicion = '',
    @NewFechaExpedicion = '';
--END_PARAM

if exists (
    select 1
    from fact_clientes
    where Numero_Documento = @NewNumeroDocumento
) then
    update fact_clientes
    set Nombres = @NewNombres,
        Apellido1 = @NewApellido1,
        Apellido2 = @NewApellido2,
        Direccion = @NewDireccion,
        Ciudad = @NewCiudad,
        Barrio = @NewBarrio,
        Departamento = @NewDepartamento,
        Pais = @NewPais,
        Email1 = @NewEmail1,
        Email2 = @NewEmail2,
        Telefono1 = @NewTelefono1,
        Telefono2 = @NewTelefono2,
        Tipo_Documento = @NewTipoDocumento,
        Pais_Expedicion = @NewPaisExpedicion,
        Departamento_Expedicion = @NewDepartamentoExpedicion,
        Ciudad_Expedicion = @NewCiudadExpedicion,
        Fecha_Expedicion = @NewFechaExpedicion
    where Numero_Documento = @NewNumeroDocumento;

    select concat('OK-Registro actualizado:', @NewNumeroDocumento, ' ', 'Update' ) as result;
else
    insert into fact_clientes (
        Nombres,
        Apellido1,
        Apellido2,
        Direccion,
        Ciudad,
        Barrio,
        Departamento,
        Pais,
        Email1,
        Email2,
        Telefono1,
        Telefono2,
        Tipo_Documento,
        Numero_Documento,
        Pais_Expedicion,
        Departamento_Expedicion,
        Ciudad_Expedicion,
        Fecha_Expedicion
    ) values (
        @NewNombres,
        @NewApellido1,
        @NewApellido2,
        @NewDireccion,
        @NewCiudad,
        @NewBarrio,
        @NewDepartamento,
        @NewPais,
        @NewEmail1,
        @NewEmail2,
        @NewTelefono1,
        @NewTelefono2,
        @NewTipoDocumento,
        @NewNumeroDocumento,
        @NewPaisExpedicion,
        @NewDepartamentoExpedicion,
        @NewCiudadExpedicion,
        @NewFechaExpedicion
    );

    select concat('OK-id_archivo:', last_insert_id(), ' ', 'Insert') as result;
end if;
