----validar si se debe agregar---
create table dim_ubicacion_proyecto(
	id_ubicacion_proyecto int not null auto_increment,
	constraint pk_dim_ubicacion_proyecto primary key (id_ubicacion_proyecto),
	ubicacion varchar(200),
	codigo varchar(10),
	id_padre int,
	is_active bit default 1,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user
);
create table dim_estado_publicacion(
	id_estado_publicacion int not null auto_increment,
	constraint pk_dim_estado_publicacion primary key (id_estado_publicacion),
	estado_publicacion varchar(200) not null unique,
	codigo varchar(10),
	is_active bit default 1,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user,
	add constraint chk_estado_publicacion_no_vacio check (trim(estado_publicacion) <> '')
);
create table dim_tipo_proyecto(
	id_tipo_proyecto int not null auto_increment,
	constraint pk_dim_tipo_proyecto primary key (id_tipo_proyecto),
	tipo_proyecto varchar(200) not null unique,
	codigo varchar(10),
	is_active bit default 1,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user,
	constraint chk_tipo_proyecto_no_vacio check (trim(tipo_proyecto) <> '')
);
create table dim_tipo_vis(
	id_tipo_vis int not null auto_increment,
	constraint pk_dim_tipo_vis primary key (id_tipo_vis),
	tipo_vis varchar(200) not null unique,
	codigo varchar(10),
	is_active bit default 1,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user,
	constraint chk_tipo_vis_no_vacio check (trim(tipo_vis) <> '')
);
create table dim_tipo_financiacion(
	id_tipo_financiacion int not null auto_increment,
	constraint pk_dim_tipo_financiacion primary key (id_tipo_financiacion),
	tipo_financiacion varchar(200) not null unique,
	porcentaje int default 0,
	codigo varchar(10),
	is_active bit default 1,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user,
	constraint chk_valor_entre_0_y_100 check (porcentaje between 0 and 100),
	constraint chk_tipo_financiacion_no_vacio check (trim(tipo_financiacion) <> '')
);
create table dim_pie_legal(
	id_pie_legal int not null auto_increment,
	constraint pk_dim_pie_legal primary key (id_pie_legal),
	pie_legal varchar(200) not null unique,
	texto text,
	notas_extra text,
	codigo varchar(10),
	is_active bit default 1,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user,
	constraint chk_pie_legal_no_vacio check (trim(pie_legal) <> '')
);
create table dim_fiduciaria(
	id_fiduciaria int not null auto_increment,
	fiduciaria varchar(200) not null unique,
	codigo varchar(10),
	is_active bit default 1,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user,
	constraint pk_id_fiduciaria primary key (id_fiduciaria),
	constraint chk_fiduciaria_no_vacio check (trim(fiduciaria) <> '')
);

create table dim_opcion_visual(
	id_opcion_visual int not null auto_increment,
	constraint pk_dim_opcion_visual primary key (id_opcion_visual),
	opcion_visual varchar(200),
	codigo varchar(10),
	is_active bit default 1,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user
);

create table dim_zona_proyecto (
    id_zona_proyecto INT NOT NULL auto_increment,
    constraint pk_dim_zona_proyecto primary key (id_zona_proyecto),
    zona_proyecto varchar(200) not null unique,
	id_sede int,
    codigo varchar(10),
    is_active bit default 1,
    created_on datetime default current_timestamp,
    created_by varchar(200) default CURRENT_USER,
    constraint fk_zona_sede foreign key (id_sede) references dim_sede(id_sede),
    constraint chk_zona_no_vacio check (trim(zona_proyecto) <> '')
);
create table dim_ciudadela (
    id_ciudadela int not null auto_increment,
    constraint pk_ciudadela primary key (id_ciudadela),
    ciudadela varchar(200) not null unique,
	id_sede int,
	id_zona_proyecto int,
    codigo varchar(10),
    is_active bit default 1,
    created_on datetime default current_timestamp,
    created_by varchar(200) default current_user,
	constraint fk_ciudadela_sede foreign key (id_sede) 
		references dim_sede(id_sede),
	constraint fk_ciudadela_zona foreign key (id_zona_proyecto) 
		references dim_zona_proyecto(id_zona_proyecto),
	constraint chk_ciudadela_no_vacio check (trim(ciudadela) <> '')
);
create table dim_banco_constructor(
	id_banco int not null,
	banco varchar(200) not null unique,
    is_active bit default 1,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user,
	constraint pk_dim_banco_constructor primary key(id_banco),
	constraint chk_banco_no_vacio check (trim(banco) <> '')
);
create trigger tr_insert_banco after insert on dim_banco_constructor for each row
begin
	insert into dim_banco_factor (id_banco, id_factor, id_tipo_factor, valor)
	select 
		new.id_banco as id_banco,
		f.id_factor,
		t.id_tipo_factor,
		0 as valor
	from 
		dim_factor f
	cross join 
		dim_tipo_factor t;
end;

create table fact_banco_constructor (
    id_proyecto int not null,
    id_banco_constructor int not null,
    primary key (id_proyecto, id_banco_constructor),
    constraint fk_fbcon_proyecto foreign key (id_proyecto) 
        references fact_proyectos(id_proyecto),
    constraint fk_fbcon_banco foreign key (id_banco_constructor) 
        references dim_banco_constructor(id_banco)
);

create table fact_tipos_financiacion( 
    id_proyecto int not null,
    id_tipo_financiacion int not null,
    primary key (id_proyecto, id_tipo_financiacion),
    constraint fk_ftf_proyecto foreign key (id_proyecto) 
        references fact_proyectos(id_proyecto),
    constraint fk_ftf_fing foreign key (id_tipo_financiacion) 
        references dim_tipo_financiacion(id_tipo_financiacion)
);

create table fact_banco_financiador (
    id_proyecto int not null,
    id_banco_financiador int not null,
    primary key (id_proyecto, id_banco_financiador),
    constraint fk_fbfin_proyecto foreign key (id_proyecto) 
        references fact_proyectos(id_proyecto),
    constraint fk_fbfin_banco foreign key (id_banco_financiador) 
        references dim_banco_constructor(id_banco)
);

create table fact_sala_venta (
	id_proyecto int not null,
	id_sala_venta int not null,
	primary key (id_proyecto, id_sala_venta),
	constraint fk_fsala_proyecto foreign key (id_proyecto) 
		references fact_proyectos(id_proyecto),
	constraint fk_fsala_sala foreign key (id_sala_venta) 
		references dim_sala_venta(id_sala_venta)
);

create table fact_estado_publicacion (
    id_proyecto int not null,
    id_estado_publicacion int not null,
    primary key (id_proyecto, id_estado_publicacion),
    constraint fk_estado_proyecto foreign key (id_proyecto) 
        references fact_proyectos(id_proyecto),
    constraint fk_estado_publicacion foreign key (id_estado_publicacion) 
        references dim_estado_publicacion(id_estado_publicacion)
);

create table fact_tipo_proyecto (
    id_proyecto int not null,
    id_tipo_proyecto int not null,
    primary key (id_proyecto, id_tipo_proyecto),
    constraint fk_fact_tipo_proyecto_proy foreign key (id_proyecto) 
        references fact_proyectos(id_proyecto),
    constraint fk_fact_tipo_proyecto_tipo foreign key (id_tipo_proyecto) 
        references dim_tipo_proyecto(id_tipo_proyecto)
);

create table fact_proyectos(
	id_proyecto int not null auto_increment,
	constraint pk_fact_proyectos primary key (id_proyecto),
	id_sede int,
	constraint fk_id_sede_fact_proyectos foreign key(id_sede) references dim_sede(id_sede),
	id_estado_publicacion int,
	constraint fk_id_estado_publicacion_fact_proyectos foreign key(id_estado_publicacion) references dim_estado_publicacion(id_estado_publicacion), 
	nombre varchar(200) not null unique,
	id_tipo_proyecto int,
	constraint fk_id_tipo_proyecto_fact_proyectos foreign key(id_tipo_proyecto) references dim_tipo_proyecto(id_tipo_proyecto),
	id_ciudadela int,
	constraint fk_id_ciudadela_fact_proyectos foreign key(id_ciudadela) references dim_ciudadela(id_ciudadela),
	subsidios_vis varchar(200),
	dias_separacion int,
	id_opcion_visual int,
	constraint fk_id_opcion_visual_fact_proyectos foreign key(id_opcion_visual) references dim_opcion_visual(id_opcion_visual),
	dias_cierre_sala int,
	meses_ci int,
	dias_pago_ci_banco_amigo int,
	id_tipo_vis int,
	constraint fk_id_tipo_vis_fact_proyectos foreign key(id_tipo_vis) references dim_tipo_vis(id_tipo_vis),
	id_tipo_financiacion int,
	constraint fk_id_tipo_financiacion_fact_proyectos foreign key(id_tipo_financiacion) references dim_tipo_financiacion(id_tipo_financiacion),
	dias_pago_ci_banco_no_amigo int,
	email_cotizaciones varchar(200),
	meta_ventas int,
	email_coordinacion_sala varchar(200),
	centro_costos varchar(4),
	id_pie_legal int,
	constraint fk_id_pie_legal_fact_proyectos foreign key(id_pie_legal) references dim_pie_legal(id_pie_legal),
	id_fiduciaria int,
	constraint fk_id_fiduciaria_fact_proyectos foreign key(id_fiduciaria) references dim_fiduciaria(id_fiduciaria),
	email_receptor_1 varchar(50),
    email_receptor_2 varchar(50),
    email_receptor_3 varchar(50),
    email_receptor_4 varchar(50),
	id_zona_proyecto int,
	constraint fk_id_zona_proyecto_fact_proyectos foreign key(id_zona_proyecto) references dim_zona_proyecto(id_zona_proyecto),
	link_waze varchar(200),
	latitud double,
	otra_info text,
	linea_whatsapp varchar(20),
	direccion varchar(200),
	lanzamiento int,
	ciudad_lanzamiento varchar(200),
	fecha_lanzamiento date,
	bloqueo_libres int,
	inmuebles_opcionados int,
	tipos_excluidos varchar(200),
	frame_seguimiento_visible int,
	link_seguimiento_leads varchar(200),
	link_general_onelink varchar(200),
	frame_evaluacion_conocimiento int,
	link_evaluacion_conocimiento varchar(200),
	link_especifico_onelink varchar(200),
	avance_obra_visible int,
	link_avance_obra varchar(200),
	incluir_brochure int,
	link_brochure varchar(200),
	incluir_especificaciones_tecnicias int,
	link_especificaciones_tecnicias varchar(200),
	incluir_cartilla_negocios_cotizacion int,
	incluir_cartilla_negocios_opcion int,
	link_cartilla_negocios varchar(200),
	salesforce_id varchar(50),
	za1_id varchar(10),
	is_active bit default 1,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user,
	id_banco_constructor int,
	descripcion_comercial varchar(5000),
	constraint fk_id_banco_constructor_fact_proyectos foreign key(id_banco_constructor) references dim_banco_constructor(id_banco),
	id_bancos_financiador int,
	constraint fk_id_bancos_financiador_fact_proyectos foreign key(id_bancos_financiador) references dim_banco_constructor(id_banco),
	id_lista int references dim_lista_precios(id_lista),
	alerta_cambio_lista varchar(200)
);
create table fact_documentos (
    id_documento int auto_increment primary key,
    documento varchar(200) not null,
    llave varchar(50) not null,
    cache_memoria bit default 0,
    is_active bit default 1,
    created_on datetime default current_timestamp,
    created_by varchar(200) default current_user
);

create table fact_documento_proyecto (
    id_documento_proyecto int auto_increment primary key,
    id_documento int not null,
    id_proyecto int,
	id_secuencia int,
	id_maestro_documento int,
	video varchar(255),
	descripcion varchar(255),
	link varchar(255),
	nombre varchar(255),
    orden int,
	tipo varchar(100),
	extension varchar(10),
    is_active bit default 1,
    created_on datetime default current_timestamp,
    created_by varchar(200) default current_user,
    foreign key (id_documento) references fact_documentos(id_documento)
);

/*
drop table fact_proyectos;
drop table dim_ubicacion_proyecto;
drop table dim_estado_publicacion;
drop table dim_tipo_proyecto;
drop table dim_tipo_vis;
drop table dim_tipo_financiacion;
drop table dim_pie_legal;
drop table dim_fiduciaria;
drop table fact_documentos;
*/

insert into dim_tipo_documento (is_tipo, is_active) values
('General', 1),
('Sostenibilidad', 1),
('Principal',1),
('Imágenes',1),
('Avances de obra',1);

insert into dim_estado_publicacion(estado_publicacion, codigo) values
('Publicado', 'PUB'),
('Excluir de Ad@', 'EXC'),
('Rot. Mostar Imágenes Generales', 'IGE'),
('Rot. Mostar Imágenes Sostenibilidad', 'ISO');

insert into dim_tipo_vis(tipo_vis) values
('No VIS'),
('VIS'),
('VIS de renovación'),
('Aplica subsidios VIS');

insert into dim_tipo_financiacion(tipo_financiacion, porcentaje)values
/*('Acabados'),
('Reformas'),*/
('Aplica Crédito 40-60', 60),
('Aplica Crédito 50-50', 50),
('Aplica Crédito 20-80', 80),
('Aplica Crédito 30-70', 70),
('Aplica Leasing 20-80', 80),
('Aplica Leasing 10-90', 90),

insert into dim_opcion_visual(opcion_visual) values
('Aumento automático PATE'),
('Aumento automático NumRef Bancaria'),
('Oculat info Separación'),
('Mostrar Botón "Link de Pagos"');
-- ('Mostrar Precio como smmlv');

insert into dim_pie_legal (pie_legal) values
('General Davivienda'),
('General Bancolombia'),
('Banco Colpatria'),
('General Davivienda NO VIS'),
('General Bancolombia NO VIS'),
('Banco Colpatria NO VIS'),
('General BBVA NO VIS'),
('General Davivienda NO VIS en SMMLV');


insert into dim_fiduciaria (fiduciaria) values
('Alianza Fiduciaria'),
('BNP Paribas'),
('BTG Pactual'),
('Citi'),
('Colmena Fiduciaria'),
('Credicorp Capital Fiduciaria'),
('Davivienda Fiduciaria'),
('Fidugraria'),
('Fiduciaria Bancolombia'),
('Fiduciaria BBVA'),
('Fiduciaria Bogotá'),
('Fiduciaria Central'),
('Fiduciaria Corficolombiana'),
('Fiduciaria Popular'),
('Fiduciaria Sura'),
('Fiducoldex'),
('Fiducoomeva'),
('Fiduoccidente'),
('Fiduprevisora'),
('GNB Sudameris'),
('Itaú Fiduciaria'),
('Renta 4 Global'),
('Santander Caceis'),
('Scotia Colpatria Fiduciaria'),
('Skandia');

insert into dim_zona_proyecto (zona_proyecto, id_sede) values
('Bogotá (Fontibón, Bosa, Centro, Sur-Occidente, Puente Aranda, Usaquén)', 1),
('Pruebas', 1),
('Sabana Norte (Chía, Zipaquirá, Tocancipá)', 1),
('Sabana Occidente (Mosquera, Madrid)', 1)
('Bello', 2),
('Envigado', 2),
('Itagüi', 2),
('Medellín', 2),
('Niquía', 2),	
('Rionegro', 2),
('Sabaneta', 2);


insert into dim_ciudadela (ciudadela, id_sede) values
('alameda de zipaquirá', 1),
('alegra', 1),
('belari', 1),
('ciudad del sol', 1),
('fontibón', 1),
('la arboleda', 1),
('la prosperidad', 1),
('la toscana', 1),
('los maderos', 1),
('novaterra', 1),
('urbania', 1);

insert into dim_tipo_proyecto (id_tipo_proyecto, tipo_proyecto, codigo) values
(8, 'Apartamentos', 'APT'),
(9, 'Casas', 'CAS'),
(10, 'Oficina', 'OFC'),
(11, 'Local', 'LOC'),
(12, 'Consultorio', 'CON'),
(13, 'Parqueadero', 'PRQ'),
(15, 'Deposito', 'DEP');
alter table dim_tipo_proyecto auto_increment = 16;

insert into dim_banco_constructor (id_banco, banco) values
(1, 'Davivienda'),
(2, 'Bancolombia'),
(3, 'Banco de Bogotá'),
(4, 'Banco Popular'),
(5, 'BBVA Colombia'),
(6, 'Banco de Occidente'),
(7, 'Banco AV Villas'),
(8, 'Scotiabank Colpatria'),
(9, 'Banco Itaú'),
(10, 'Banco Caja Social'),
(11, 'Banco GNB Sudameris'),
(12, 'Banco Pichincha'),
(14, 'Banco Finandina'),
(35, 'Carta de compromiso del Cliente'),
(51, 'Acercasa'),
(54, 'Citybank'),
(55, 'Credifamilia'),
(56, 'FNA'),
(57, 'La Hipotecaria');

insert into dim_email_receptor (email) values
(NULL),
(NULL),
(NULL),
(NULL);
