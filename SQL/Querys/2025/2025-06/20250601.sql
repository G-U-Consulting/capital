
create table fact_clientes (
    id_cliente int auto_increment primary key,
    nombres varchar(100),
    apellido1 varchar(100),
    apellido2 varchar(100),
    direccion varchar(100),
    ciudad varchar(100),
    barrio varchar(100),
    departamento varchar(100),
    pais varchar(100),
    email1 varchar(100),
    email2 varchar(100),
    telefono1 varchar(20),
    pais_tel1 char(2),
    codigo_tel1 varchar(5),
    telefono2 varchar(20),
    pais_tel2 char(2),
    codigo_tel2 varchar(5),
    descripcion text,
    observaciones text,

    tipo_documento varchar(50),
    numero_documento varchar(50),
    pais_expedicion varchar(100),
    departamento_expedicion varchar(100),
    ciudad_expedicion varchar(100),
    is_vetado bit default 0,
    is_atencion_rapida bit default 0,

    is_titular bit default 0,
    nombre_empresa varchar(100),
    nit varchar(100),
    fecha_nacimiento datetime,
    
    fecha_expedicion datetime,
    salesforce_id varchar(50),
    porcentaje_copropiedad int,
    is_politica_aceptada bit default 0,
	is_active bit default 1,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user
);

alter table fact_clientes add unique key uk_doc (numero_documento);


create table dim_tipo_registro (
    id_tipo_registro int auto_increment primary key,
    tipo_registro varchar(100) not null unique,
    is_active bit default 1,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user,
    constraint chk_tipo_registro_no_vacio check (trim(tipo_registro) <> '')
);

create table fact_cliente_actual (
    id_cliente int auto_increment primary key,
    id_proyecto int,
    username varchar(200),
    cliente varchar(200),
    is_active bit default 1,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user
);

create table dim_modo_atencion (
    id_modo_atencion int auto_increment primary key,
    modo_atencion varchar(100),
    is_active bit default 1,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user
);

create table dim_motivo_compra (
    id_motivo_compra int auto_increment primary key,
    motivo_compra varchar(100),
    is_active bit default 1,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user
);

create table dim_referencias (
    id_referencia int auto_increment primary key,
    referencia varchar(100),
    is_active bit default 1,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user
);

create table fact_tipo_registro (
    id_visita int not null,
    id_tipo_registro int not null,
    primary key (id_visita, id_tipo_registro),
    constraint fk_fact_tipo_registro_visita foreign key (id_visita) 
        references fact_visitas(id_visita),
    constraint fk_fact_tipo_registro_tipo foreign key (id_tipo_registro) 
        references dim_tipo_registro(id_tipo_registro)
);

create table fact_modo_atencion (
    id_visita int not null,
    id_modo_atencion int not null,
    primary key (id_visita, id_modo_atencion),
    constraint fk_fact_modo_atencion_visita foreign key (id_visita) 
        references fact_visitas(id_visita),
    constraint fk_fact_modo_atencion_modo foreign key (id_modo_atencion) 
        references dim_modo_atencion(id_modo_atencion)
);

create table fact_visitas (
    id_visita int auto_increment primary key,
    id_cliente int,
    id_proyecto int,
    descripcion varchar(100),
    id_categoria_medio int,
    id_medio int,
    id_motivo_compra int,
    id_presupuesto_vivienda int,
    id_tipo_tramite int,
    id_referencia int,
    id_sala_venta int references dim_sala_venta(id_sala_venta),
    id_modo_atencion int not null references dim_modo_atencion(id_modo_atencion),
    id_tipo_registro int not null references dim_tipo_registro(id_tipo_registro),
    otro_texto varchar(100),
    is_active bit default 1,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user
);
create table presupuesto_vivienda (
    id_presupuesto_vivienda int auto_increment primary key,
    rango varchar(50) not null,
    minimo int,
    maximo int
);

create table fact_cotizaciones (
    id_cotizacion int auto_increment primary key,
    id_cliente int,
    cotizacion varchar(100),
    fecha datetime,
    descripcion varchar(100),
    importe bigint,
    id_proyecto int,
    is_active bit default 1,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user
);  

create table fact_negocios_unidades (
    id_negocios_unidades int auto_increment primary key,
    id_cotizacion int,
    id_cliente int,
    id_proyecto int,
    usuario varchar(200),
    unidad int,
    id_unidad int,
    consecutivo varchar(50),
    cotizacion int,
    inv_terminado varchar(2),
    numero_apartamento varchar(50),
    tipo varchar(50),
    torre int,
    observacion_apto text,
    proyecto varchar(100),
    valor_descuento decimal(20,2),
    valor_unidad decimal(20,2),
    valor_acabados  decimal(20, 2),
	valor_reformas  decimal(20, 2),
    valor_separacion decimal(20, 2),
    salesforce_oportunidad_id varchar(50),
    lista varchar(100),
    fecha_entrega datetime,
    is_asignado bit default 1,
    is_active bit default 1,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user
);


/*
drop table fact_clientes;
drop table dim_tipo_registro;
drop table dim_modo_atencion;
drop table dim_motivo_compra;
drop table dim_referencias;
drop table fact_visitas;
drop table presupuesto_vivienda;
*/

insert into dim_motivo_compra (motivo_compra) 
values ('Primera vivienda'),
('Segunda vivienda'),
('Inversión');

insert into dim_referencias (referencia) 
values ('No ha recibido referencias'),
('Ha recibido referencias POSITIVAS'),
('Ha recibido referencias NEGATIVAS');

insert into dim_tipo_registro (tipo_registro) 
values ('Presencial'),
('Telefónico'),
('WhatsApp'),
('Email'),
('Videollamada');

insert into dim_modo_atencion (modo_atencion) 
values 
-- ('Rápida'),
('Información'),
('Cierre'),
('Tramites'),
('Otro');

insert into presupuesto_vivienda (rango, minimo, maximo)
values
('Menos de $2.400.000', null, 2400000),
('$2.400.001 a $4.800.000', 2400001, 4800000),
('$4.800.001 a $7.200.000', 4800001, 7200000),
('$7.200.001 a $10.400.000', 7200001, 10400000),
('$10.400.001 a $12.000.000', 10400001, 12000000),
('$12.000.000 en adelante', 12000000, null);


create table fact_borrador_opcion (
    id_borrador int auto_increment primary key,
    id_opcion int not null default 0,
    id_cotizacion int not null,
    id_cliente int not null,
    id_proyecto int not null,
    datos_json text not null,
    fecha_creacion datetime,
    fecha_modificacion datetime,
    usuario_creacion varchar(100),

    unique key unique_borrador (id_cotizacion, id_cliente, id_proyecto, id_opcion)
);
