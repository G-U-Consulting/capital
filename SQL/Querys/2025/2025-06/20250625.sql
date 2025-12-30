create table dim_lista_precios(
	id_lista int primary key auto_increment,
	lista varchar(50) not null,
	id_proyecto int not null references fact_proyectos(id_proyecto),
	descripcion varchar(200),
	updated_on datetime default current_timestamp,
	updated_by varchar(50),
	constraint uk_lista_precios_proyecto unique(lista, id_proyecto)
);
create table fact_torres(
	id_torre int not null auto_increment,
	constraint pk_id_torre primary key(id_torre),
	id_proyecto int not null,
	constraint fk_id_proyecto_fact_torres foreign key(id_proyecto) references fact_proyectos(id_proyecto),
	nombre_torre varchar(50),
	consecutivo int,
	orden_salida int not null,
	en_venta bit default 0,
	aptos_piso int not null,
	aptos_fila int not null,
	id_sinco varchar(50),
	propuesta_pago bit default 0,
	fecha_p_equ date,
	fecha_inicio_obra date,
	fecha_escrituracion date,
	tasa_base decimal(20,2) default 0,
	antes_p_equ decimal(20,2) default 0,
	despues_p_equ decimal(20,2) default 0,
	id_fiduciaria int references dim_fiduciaria(id_fiduciaria),
	cod_proyecto_fid varchar(50),
	nit_fid_doc_cliente varchar(50),
	id_instructivo int references dim_instructivo(id_instructivo),
	is_active bit default 1,
	id_banco_constructor int references dim_banco_constructor(id_banco),
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user,
	check (aptos_fila <= aptos_piso)
);
create index ix_id_proyecto_fact_torres on fact_torres(id_proyecto);
create table dim_estado_unidad(
	id_estado_unidad int not null,
	constraint pk_id_estado_unidad primary key(id_estado_unidad),
	estado_unidad varchar(100) not null unique,
	estado_unidad_plural varchar(100) not null,
	color_fondo varchar(20),
	color_fuente varchar(20),
	is_active bit default 1,
	is_virtual bit default 0,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user,
	constraint chk_estado_unidad_no_vacio check (trim(estado_unidad) <> '')
);
insert into dim_estado_unidad(id_estado_unidad, estado_unidad, estado_unidad_plural, color_fondo, color_fuente, is_virtual) values
(1, 'Libre','Libres', '#FFFFFF', '#000000', 0),
(2, 'Opcionado','Opcionados', '#0094b9', '#FFFFFF', 0),
(3, 'Consignado','Consignados', '#0c62a4', '#FFFFFF', 0),
(4, 'Vendido','Vendidos', '#173d5b', '#FFFFFF', 0),
(5, 'Opcionado (v)', 'Opcionados (v)', '#0094b9', '#FFFFFF', 1),
(6, 'Opcionado (bloq)', 'Opcionados (bloq)', '#0094b9', '#FFFFFF', 1);

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

create table dim_agrupacion_unidad(
	id_agrupacion int primary key auto_increment,
	id_proyecto int not null references fact_proyectos(id_proyecto),
	nombre varchar(50) not null,
	descripcion varchar(200),
	constraint uk_agrupacion_unidad_proyecto unique(id_proyecto, nombre)
);

create table dim_tipo_unidad(
	id_tipo int primary key auto_increment,
	tipo varchar(50) not null,
	id_proyecto int not null references fact_proyectos(id_proyecto),
	id_archivo_planta int references fact_documento_proyecto(id_documento_proyecto),
	id_archivo_recorrido int references fact_documento_proyecto(id_documento_proyecto),
	unique(tipo, id_proyecto)
);

create table dim_lista_tipo_torre(
	id_tipo int not null references dim_tipo_unidad(id_tipo),
	id_torre int not null references fact_torres(id_torre),
	id_lista int references dim_lista_precios(id_lista),
	primary key(id_tipo, id_torre)
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
	numero_apartamento varchar(10),
	piso int,
	id_tipo int references dim_tipo_unidad(id_tipo),
	codigo_planta varchar(50),
	clase varchar(50),
	id_clase int references dim_tipo_proyecto(id_tipo_proyecto),
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
	valor_complemento decimal(20, 2),
	pate varchar(50),
	encargo_fiduciario varchar(50),
	id_cuenta_convenio int,
	constraint fk_id_cuenta_convenio_fact_unidades foreign key(id_cuenta_convenio) references dim_cuenta_convenio(id_cuenta_convenio),
	asoleacion varchar(50),
	id_lista int references dim_lista_precios(id_lista),
	altura varchar(50),
	cerca_porteria bit default 0,
	cerca_juegos_infantiles bit default 0,
	cerca_piscina bit default 0,
	tiene_balcon bit default 0,
	tiene_parq_sencillo bit default 0,
	tiene_parq_doble bit default 0,
	tiene_deposito bit default 0,
	tiene_acabados bit default 0,
	za1_id int,
	salesforce_id varchar(50)
	is_active bit default 1,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user,
	updated_on datetime default current_timestamp,
	updated_by varchar(200),
	id_agrupacion int references dim_agrupacion_unidad(id_agrupacion),
	constraint uk_unidad_torre_proyecto unique(numero_apartamento, id_torre, id_proyecto, id_clase)
);
create table dim_precio_unidad(
	id_lista int not null references dim_lista_precios(id_lista),
	id_unidad int not null references fact_unidades(id_unidad),
	id_precio int,
	precio decimal(20, 2) default 0,
	en_smlv decimal(20, 2) default 0,
	precio_m2 decimal(20, 2) default 0,
	precio_alt decimal(20, 2) default 0,
	en_smlv_alt decimal(20, 2) default 0,
	precio_m2_alt decimal(20, 2) default 0,
	updated_on datetime default current_timestamp,
	updated_by varchar(50),
	primary key(id_lista, id_unidad)
);

create table dim_log_unidades(
	id_log int primary key auto_increment,
	id_unidad int not null references fact_unidades(id_unidad),
	id_usuario int not null references fact_usuarios(id_usuario),
	fecha datetime default current_timestamp,
	titulo varchar(200) not null,
	texto text,
	id_tarea int references dim_tarea_usuario(id_tarea),
	id_estado_unidad1 int references dim_estado_unidad(id_estado_unidad),
	id_estado_unidad2 int references dim_estado_unidad(id_estado_unidad)
);
