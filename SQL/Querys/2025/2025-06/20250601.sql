
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
    telefono2 varchar(20),

    tipo_documento varchar(50),
    numero_documento varchar(50),
    pais_expedicion varchar(100),
    departamento_expedicion varchar(100),
    ciudad_expedicion varchar(100),
    fecha_expedicion datetime,
	is_active bit default 1,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user
);

create table dim_tipo_registro (
    id_tipo_registro int auto_increment primary key,
    tipo_registro varchar(100),
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
    descripcion varchar(100),
    id_medio int,
    id_motivo_compra int,
    presupuesto_disponible decimal(10,2),
    id_referencia int,
    otro_texto varchar(100),
    is_active bit default 1,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user
)


/*
drop table fact_clientes;
drop table dim_tipo_registro;
drop table dim_modo_atencion;
drop table dim_motivo_compra;
drop table dim_referencias;
drop table fact_visitas;
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
values ('Rápida'),
('Información'),
('Cierre'),
('Trámites'),
('Otro');


