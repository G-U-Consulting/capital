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
create table dim_estado_pubicacion(
	id_estado_publicacion int not null auto_increment,
	constraint pk_dim_estado_pubicacion primary key (id_estado_publicacion),
	estado_publicacion varchar(200),
	codigo varchar(10),
	is_active bit default 1,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user
);
create table dim_tipo_proyecto(
	id_tipo_proyecto int not null auto_increment,
	constraint pk_dim_tipo_proyecto primary key (id_tipo_proyecto),
	tipo_proyecto varchar(200),
	codigo varchar(10),
	is_active bit default 1,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user
);
create table dim_tipo_vis(
	id_tipo_vis int not null auto_increment,
	constraint pk_dim_tipo_vis primary key (id_tipo_vis),
	tipo_vis varchar(200),
	codigo varchar(10),
	is_active bit default 1,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user
);
create table dim_tipo_financiacion(
	id_tipo_financiacion int not null auto_increment,
	constraint pk_dim_tipo_financiacion primary key (id_tipo_financiacion),
	tipo_financiacion varchar(200),
	codigo varchar(10),
	is_active bit default 1,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user
);
create table dim_pie_legal(
	id_pie_legal int not null auto_increment,
	constraint pk_dim_pie_legal primary key (id_pie_legal),
	pie_legal varchar(200),
	codigo varchar(10),
	is_active bit default 1,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user
);
create table dim_fiduciaria(
	id_fiduciaria int not null auto_increment,
	fiduciaria varchar(200),
	codigo varchar(10),
	is_active bit default 1,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user,
	constraint pk_id_fiduciaria primary key (id_fiduciaria)
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

create table fact_proyectos(
	id_proyecto int not null auto_increment,
	constraint pk_fact_proyectos primary key (id_proyecto),
	id_sede int,
	constraint fk_id_sede_fact_proyectos foreign key(id_sede) references dim_sede(id_sede),
	id_ubicacion_proyecto int,
	constraint fk_id_ubicacion_proyecto_fact_proyectos foreign key(id_ubicacion_proyecto) references dim_ubicacion_proyecto(id_ubicacion_proyecto),
	nombre varchar(200),
	id_tipo_proyecto int,
	constraint fk_id_tipo_proyecto_fact_proyectos foreign key(id_tipo_proyecto) references dim_tipo_proyecto(id_tipo_proyecto),
	subsidios_vis varchar(200),
	dias_separacion int,
	dias_cierre_sala int,
	meses_ci int,
	dias_pago_ci_banco_amigo int,
	dias_pago_ci_banco_no_amigo int,
	email_cotizaciones varchar(200),
	email_coordinador_sala varchar(200),
	meta_ventas int,
	centro_costos varchar(50),
	id_pie_legal int,
	constraint fk_id_pie_legal_fact_proyectos foreign key(id_pie_legal) references dim_pie_legal(id_pie_legal),
	id_fiduciaria int,
	constraint fk_id_fiduciaria_fact_proyectos foreign key(id_fiduciaria) references dim_fiduciaria(id_fiduciaria),
	link_waze varchar(200),
	latitud double,
	otra_info text,
	linea_whatsapp varchar(20),
	direccion varchar(200),
	lanzamiento bit,
	ciudad_lanzamiento varchar(200),
	fecha_lanzamiento date,
	bloqueo_libres bit,
	inmuebles_opcionados int,
	tipos_excluidos varchar(200),
	frame_seguimiento_visible bit,
	link_seguimiento_leads varchar(200),
	link_general_onelink varchar(200),
	frame_evaluacion_conocimiento bit,
	link_evaluacion_conocimiento varchar(200),
	link_especifico_onelink varchar(200),
	avance_obra_visible bit,
	link_avance_obra varchar(200),
	incluir_brochure bit,
	link_brochure varchar(200),
	incluir_especificaciones_tecnicias bit,
	link_especificaciones_tecnicias varchar(200),
	incluir_cartilla_negocios_cotizacion bit,
	incluir_cartilla_negocios_opcion bit,
	link_cartilla_negocios varchar(200),
	is_active bit default 1,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user,
	id_banco_constructor int,
	constraint fk_id_banco_fact_proyectos foreign key(id_banco_constructor) references dim_banco_constructor(id_banco)
);
/*
drop table fact_proyectos;
drop table dim_ubicacion_proyecto;
drop table dim_estado_pubicacion;
drop table dim_tipo_proyecto;
drop table dim_tipo_vis;
drop table dim_tipo_financiacion;
drop table dim_pie_legal;
drop table dim_fiduciaria;
*/

insert into dim_estado_pubicacion(estado_publicacion, codigo) values
('Publicado', 'PUB'),
('Excluir de Ad@', 'EXC'),
('Rot. Mostar Imágenes Generales', 'IGE'),
('Rot. Mostar Imágenes Sostenibilidad', 'ISO'),
('Próxima Certificación Edge', 'PED'),
('Vigente Certificación Edge', 'VED');

insert into dim_tipo_vis(tipo_vis) values
('No VIS'),
('VIS'),
('VIS de renovación'),
('Aplica subsidios VIS');

insert into dim_tipo_financiacion(tipo_financiacion)values
/*('Acabados'),
('Reformas'),*/
('Aplica Crédito 40-60'),
('Aplica Crédito 50-50'),
('Aplica Crédito 20-80'),
('Aplica Leasing 20-80'),
('Aplica Leasing 10-90'),

insert into dim_opcion_visual(opcion_visual) values
('Aumento automático PATE'),
('Aumento automático NumRef Bancaria'),
('Oculat info Separación'),
('Mostrar Botón "Link de Pagos"'),
('Mostrar Precio como smmlv');