create table fact_torres(
	id_torre int not null auto_increment,
	constraint pk_id_torre primary key(id_torre),
	id_proyecto int not null,
	constraint fk_id_proyecto_fact_torres foreign key(id_proyecto) references fact_proyectos(id_proyecto),
	nombre_torre varchar(50),
	consecutivo int,
	is_active bit default 1,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user
);
create index ix_id_proyecto_fact_torres on fact_torres(id_proyecto);
create table dim_estado_unidad(
	id_estado_unidad int not null,
	constraint pk_id_estado_unidad primary key(id_estado_unidad),
	estado_unidad varchar(100),
	estado_unidad_plural varchar(100),
	color_fondo varchar(20),
	color_fuente varchar(20),
	is_active bit default 1,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user
);
insert into dim_estado_unidad(id_estado_unidad, estado_unidad, estado_unidad_plural, color_fondo, color_fuente) values
(1, 'Libre','Libres', '#FFF', '#000'),
(2, 'Opcionado','Opcionados', '#0094b9', '#FFF'),
(3, 'Consignado','Consignados', '#0c62a4', '#FFF'),
(4, 'Vendido','Vendidos', '#173d5b', '#FFF');

create table dim_cuenta_convenio(
	id_cuenta_convenio int not null auto_increment,
	constraint pk_id_cuenta_convenio primary key(id_cuenta_convenio),
	cuenta_tipo varchar(50),
	cuenta_numero varchar(50),
	convenio varchar(50),
	cuota_inicial_banco varchar(50),
	ean varchar(50),
	is_active bit default 1,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user
);
create table fact_unidades(
	id_unidad int not null auto_increment,
	constraint pk_id_unidad primary key(id_unidad),
	id_proyecto int not null,
	constraint fk_id_proyecto_fact_unidades foreign key(id_proyecto) references fact_proyectos(id_proyecto),
	id_torre int not null,
	constraint fk_id_torre_fact_unidades foreign key(id_torre) references fact_torres(id_torre),
	id_estado_unidad int,
	constraint fk_id_estado_unidad_fact_unidades foreign key(id_estado_unidad) references dim_estado_unidad(id_estado_unidad),
	nombre_unidad varchar(50),
	numero_apartamento int,
	piso int,
	tipo varchar(50),
	codigo_planta varchar(50),
	localizacion varchar(50),
	observacion_apto varchar(500),
	fecha_fec date,
	fecha_edi date,
	fecha_edi_mostrar date,
	inv_terminado bit,
	num_alcobas int,
	num_banos int,
	area_privada_cub decimal(20, 2),
	area_privada_lib decimal(20, 2),
	area_total decimal(20, 2),
	acue  decimal(20, 2),
	area_total_mas_acue  decimal(20, 2),
	valor_separacion  decimal(20, 2),
	valor_acabados  decimal(20, 2),
	valor_reformas  decimal(20, 2),
	valor_descuento  decimal(20, 2),
	pate varchar(50),
	id_cuenta_convenio int,
	constraint fk_id_cuenta_convenio_fact_unidades foreign key(id_cuenta_convenio) references dim_cuenta_convenio(id_cuenta_convenio),
	asoleacion varchar(50),
	altura varchar(50),
	is_active bit default 1,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user
);