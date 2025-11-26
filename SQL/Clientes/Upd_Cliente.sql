-- =============================================
-- Proceso: CLientes/Upd_Cliente
-- =============================================
--START_PARAM
set @id_cliente = NULL,
    @nombres = NULL,
    @apellido1 = NULL,
    @apellido2 = NULL,
    @direccion = NULL,
    @ciudad = NULL,
    @barrio = NULL,
    @departamento = NULL,
    @pais = NULL,
    @email1 = NULL,
    @email2 = NULL,
    @telefono1 = NULL,
    @pais_tel1 = NULL,
    @codigo_tel1 = NULL,
    @telefono2 = NULL,
    @pais_tel2 = NULL,
    @codigo_tel2 = NULL,
    @tipo_documento = NULL,
    @numero_documento = NULL,
    @pais_expedicion = NULL,
    @departamento_expedicion = NULL,
    @ciudad_expedicion = NULL,
    @fecha_expedicion = NULL,
    @descripcion = NULL;
--END_PARAM

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
    pais_tel1 = @pais_tel1,
    codigo_tel1 = @codigo_tel1,
    telefono2 = @telefono2,
    pais_tel2 = @pais_tel2,
    codigo_tel2 = @codigo_tel2,
    tipo_documento = @tipo_documento,
    pais_expedicion = @pais_expedicion,
    departamento_expedicion = @departamento_expedicion,
    ciudad_expedicion = @ciudad_expedicion,
    fecha_expedicion = @fecha_expedicion,
    numero_documento = @numero_documento,
    descripcion = @descripcion
where id_cliente = @id_cliente;

select 'OK' as result;