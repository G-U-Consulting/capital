-- =============================================
-- Proceso: ProcesoNegocio/Ins_ClientesAgrupado
-- =============================================
--START_PARAM
set @clientes_json = '';
--END_PARAM

create temporary table tmp_clientes (
    nombres varchar(100),
    apellido1 varchar(100),
    apellido2 varchar(100),
    direccion varchar(200),
    ciudad varchar(100),
    barrio varchar(100),
    departamento varchar(100),
    pais varchar(100),
    email1 varchar(150),
    email2 varchar(150),
    telefono1 varchar(50),
    telefono2 varchar(50),
    tipoDocumento varchar(20),
    numeroDocumento varchar(50),
    paisExpedicion varchar(100),
    departamentoExpedicion varchar(100),
    ciudadExpedicion varchar(100),
    fechaExpedicion date,
    isPoliticaAceptada tinyint,
    is_atencion_rapida tinyint,
    is_titular tinyint,
    nombreEmpresa varchar(150),
    nit varchar(100),
    fechaNacimiento date,
    porcentaje_copropiedad int
);

insert into tmp_clientes
select
    JSON_UNQUOTE(JSON_EXTRACT(j.value, '$.nombres')),
    JSON_UNQUOTE(JSON_EXTRACT(j.value, '$.apellido1')),
    JSON_UNQUOTE(JSON_EXTRACT(j.value, '$.apellido2')),
    JSON_UNQUOTE(JSON_EXTRACT(j.value, '$.direccion')),
    JSON_UNQUOTE(JSON_EXTRACT(j.value, '$.ciudad')),
    JSON_UNQUOTE(JSON_EXTRACT(j.value, '$.barrio')),
    JSON_UNQUOTE(JSON_EXTRACT(j.value, '$.departamento')),
    JSON_UNQUOTE(JSON_EXTRACT(j.value, '$.pais')),
    JSON_UNQUOTE(JSON_EXTRACT(j.value, '$.email1')),
    JSON_UNQUOTE(JSON_EXTRACT(j.value, '$.email2')),
    JSON_UNQUOTE(JSON_EXTRACT(j.value, '$.telefono1')),
    JSON_UNQUOTE(JSON_EXTRACT(j.value, '$.telefono2')),
    JSON_UNQUOTE(JSON_EXTRACT(j.value, '$.tipoDocumento')),
    JSON_UNQUOTE(JSON_EXTRACT(j.value, '$.numeroDocumento')),
    JSON_UNQUOTE(JSON_EXTRACT(j.value, '$.paisExpedicion')),
    JSON_UNQUOTE(JSON_EXTRACT(j.value, '$.departamentoExpedicion')),
    JSON_UNQUOTE(JSON_EXTRACT(j.value, '$.ciudadExpedicion')),
    JSON_UNQUOTE(JSON_EXTRACT(j.value, '$.fechaExpedicion')),
    cast(JSON_UNQUOTE(JSON_EXTRACT(j.value, '$.isPoliticaAceptada')) as signed),
    cast(JSON_UNQUOTE(JSON_EXTRACT(j.value, '$.is_atencion_rapida')) as signed),
    cast(JSON_UNQUOTE(JSON_EXTRACT(j.value, '$.is_titular')) as signed),
    JSON_UNQUOTE(JSON_EXTRACT(j.value, '$.nombreEmpresa')),
    JSON_UNQUOTE(JSON_EXTRACT(j.value, '$.nit')),
    JSON_UNQUOTE(JSON_EXTRACT(j.value, '$.fechaNacimiento')),
    cast(JSON_UNQUOTE(JSON_EXTRACT(j.value, '$.porcentaje_copropiedad')) as signed)
from JSON_TABLE(@clientes_json, '$[*]' columns (value json path '$')) j;


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
    fecha_nacimiento,
    porcentaje_copropiedad
)
select
    t.nombres,
    t.apellido1,
    t.apellido2,
    t.direccion,
    t.ciudad,
    t.barrio,
    t.departamento,
    t.pais,
    t.email1,
    t.email2,
    t.telefono1,
    t.telefono2,
    t.tipoDocumento,
    t.numeroDocumento,
    t.paisExpedicion,
    t.departamentoExpedicion,
    t.ciudadExpedicion,
    t.fechaExpedicion,
    t.isPoliticaAceptada,
    t.is_atencion_rapida,
    t.is_titular,
    t.nombreEmpresa,
    t.nit,
    t.fechaNacimiento,
    t.porcentaje_copropiedad
from tmp_clientes t
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
    porcentaje_copropiedad = values(porcentaje_copropiedad);

drop temporary table if exists tmp_clientes;

select 'OK - Clientes insertados o actualizados correctamente' as result;
