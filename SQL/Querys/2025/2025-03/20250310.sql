create table dim_sede(
	id_sede int not null,
	sede varchar(100) not null unique key,
	alias varchar(3),
    is_active bit default 1,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user,
	constraint pk_dim_sede primary key(id_sede)
);
insert into dim_sede(id_sede, sede, alias) values
(1, 'Bogotá','BOG'),
(2, 'Medellín','MED')

create table dim_zona(
	id_zona int not null,
	zona varchar(100),
	alias varchar(3),
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user,
	constraint pk_id_zona primary key(id_zona)
);
insert into dim_zona(id_zona, zona, alias) values
(1, 'Zona Usuarios','ZU'),
(2, 'Zona Asesores','ZA'),
(3, 'Zona Obras','ZO')

create table dim_cargo (
    id_cargo int auto_increment,
    cargo varchar(100),
	descripcion varchar(250),
    is_active bit default 1,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user,
	constraint pk_id_cargo primary key(id_cargo)
);

insert into dim_cargo (cargo) values
('Gerente'),
('Analista'),
('Desarrollador'),
('Administrador'),
('Soporte');


create table dim_tipo_usuario (
    id_tipo_usuario int auto_increment,
    tipo_usuario varchar(100),
    is_active bit default 1,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user,
	constraint pk_id_tipo_usuario primary key(id_tipo_usuario)
);
insert into dim_tipo_usuario (id_tipo_usuario, tipo_usuario) values
(1, 'Local'),
(2, 'Azure')

create table fact_usuarios(
	id_usuario int not null auto_increment,
	usuario varchar(200),
	identificacion varchar(20) not null unique,
	nombres varchar(200) not null,
	email varchar(200),
	id_cargo int,
	id_tipo_usuario int,
	is_active bit default 1,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user,
	constraint pk_id_usuario primary key(id_usuario),
	constraint fk_fu_id_cargo foreign key(id_cargo) references dim_cargo(id_cargo),
	constraint fk_fu_Id_tipo_usuario foreign key(id_tipo_usuario) references dim_tipo_usuario(id_tipo_usuario)
);

--drop table dim_permiso
create table dim_permiso(
	id_permiso int not null,
	permiso varchar(200),
	grupo varchar(200),
	id_zona int,
	is_active bit default 1,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user,
	constraint pk_id_permiso primary key(id_permiso),
	constraint fk_dp_id_zona foreign key(id_zona) references dim_zona(id_zona)
);
insert into dim_permiso(id_permiso, permiso, grupo, id_zona) values
(1, 'Visualización de usuarios', 'Administración de Usuarios', 1),
(2, 'Creación de usuarios', 'Administración de Usuarios', 1),
(3, 'Edición de usuarios', 'Administración de Usuarios', 1),
(4, 'Reiniciar contraseñas', 'Administración de Usuarios', 1),
(5, 'Bloquear/Desbloquear usuarios', 'Administración de Usuarios', 1),

(6, 'Visualización de roles', 'Administración de Roles', 1),
(7, 'Creación de roles', 'Administración de Roles', 1),
(8, 'Edición de roles', 'Administración de Roles', 1),

(9, 'Cambio de políticas de contraseña', 'Seguridad', 1),

(10, 'Cambio de fondo de pantalla', 'Varios', 1),

(11, 'Visualizar proyectos', 'Proyectos', 2),
(12, 'Crear proyectos', 'Proyectos', 2),
(12, 'Informes generales', 'Informes', 2)

create table fact_roles(
	id_rol int not null auto_increment,
	rol varchar(200),
	id_sede int,
	descripcion varchar(1000),
	is_active bit default 1,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user,
	constraint pk_id_rol primary key(id_rol),
	constraint fk_id_sede_fact_roles foreign key(id_sede) references dim_sede(id_sede)
);
create table fact_permisos_roles(
	id_permiso_rol int not null auto_increment,
	id_permiso int,
	id_rol int,
	is_active bit default 1,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user,
	constraint pk_id_permiso_rol primary key(id_permiso_rol),
	constraint fk_id_permiso foreign key(id_permiso) references dim_permiso(id_permiso),
	constraint fk_id_rol foreign key(id_rol) references fact_roles(id_rol)
);

create table fact_roles_usuarios(
	id_rol_usuario int not null auto_increment,
	id_usuario int,
	id_rol int,
	is_active bit default 1,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user,
	constraint pk_id_rol_usuario primary key(id_rol_usuario),
	constraint fk_fru_id_rol foreign key(id_rol) references fact_roles(id_rol),
	constraint fk_fru_id_usuario foreign key(id_usuario) references fact_usuarios(id_usuario)
);

create table dim_variables_globales (
    nombre_variable varchar(50) not null,
    valor json null,
    created_on datetime default current_timestamp,
    updated_on datetime default current_timestamp on update current_timestamp,
    editable boolean default 1,
    constraint pk_variables_globales primary key (nombre_variable)
);

create table fact_documentos(
	id_documento int not null auto_increment,
	documento varchar(200),
	llave varchar(50),
	cache_memoria bit,
	is_active bit default 1,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user,
	constraint pk_fact_documentos primary key (id_documento)
)
create table fact_proyectos(
	id_proyecto int not null auto_increment,
	
	is_active bit default 1,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user,
	constraint pk_id_proyecto primary key(id_proyecto)
);

create table dim_carrusel_imagenes (
    id int auto_increment primary key,
    nombre_archivo varchar(255),
    orden int,
    created_on datetime default current_timestamp
);



create table AuditoriaSQL (
	id bigint auto_increment primary key,
	operacion varchar(50) not null,
	datos text not null,
	fecha datetime default current_timestamp,
	username varchar(255),
	error varchar(255)
);
create table dim_procedimientos_informes (
    id_procedimiento_informe int auto_increment primary key,
    procedimiento varchar(100),
    nombre varchar(50),
    is_active bit default 1,
    tipo varchar(20),
    created_by varchar(200),
    created_on datetime default current_timestamp
);

---Ejemplos--
insert into dim_procedimientos_informes (procedimiento, nombre, tipo)
values 
('Atenciones Con Cédula', 'Atenciones Con Cédula', 'Informes'),
('Inventario Apartamentos', 'Inventario Apartamentos', 'Informes'),
('Trazabilidad Estatus', 'Trazabilidad Estatus', 'Informes'),
('Tipos Atención vs. Estatus Trazados', 'Tipos Atención vs. Estatus Trazados', 'Informes'),
('Consolidado Resúmenes Generales', 'Consolidado Resúmenes Generales', 'Informes'),
('Resúmenes por TIPO', 'Resúmenes por TIPO', 'Informes'),
('CSV backup contactos Hubspot', 'CSV backup contactos Hubspot', 'Informes');

insert into dim_procedimientos_informes (procedimiento, nombre, tipo)
values 
('Base de Datos Clientes Interesados', 'Clientes Interesados Proyectos', 'Archivos'),
('Seguimiento Visitas Sala de Ventas', 'Registro Visitas Sala_Ventas', 'Archivos'),
('Inventario General de Unidades', 'Inventario Unidades Disponibles', 'Archivos'),
('Cierre Mensual de Ventas', 'Ventas Mensuales Resumen', 'Archivos'),
('Consolidado de Costos de Obra', 'Costos Obra Consolidado', 'Archivos');
-------------------------------------------

create table dim_factor(
	id_factor int auto_increment primary key,
	factor varchar(50) not null,
	unidad VARCHAR(50) not null,
	constraint unique_factor_unidad unique(factor, unidad)
);

insert into dim_factor(factor) values('5 años', 'COP');
insert into dim_factor(factor) values('10 años', 'COP');
insert into dim_factor(factor) values('15 años', 'COP');
insert into dim_factor(factor) values('20 años', 'COP');
insert into dim_factor(factor) values('25 años', 'COP');
insert into dim_factor(factor) values('30 años', 'COP');
insert into dim_factor(factor) values('5 años', 'UVR');
insert into dim_factor(factor) values('10 años', 'UVR');
insert into dim_factor(factor) values('15 años', 'UVR');
insert into dim_factor(factor) values('20 años', 'UVR');
insert into dim_factor(factor) values('25 años', 'UVR');
insert into dim_factor(factor) values('30 años', 'UVR');

create table dim_tipo_factor(
	id_tipo_factor int primary key auto_increment,
	tipo_factor varchar(50) not null
);

insert into dim_tipo_factor(tipo_factor) values('VIS');
insert into dim_tipo_factor(tipo_factor) values('NO VIS');
insert into dim_tipo_factor(tipo_factor) values('VIS + EDGE');
insert into dim_tipo_factor(tipo_factor) values('NO VIS + EDGE');

create table dim_banco_factor(
	id_banco_factor int primary key auto_increment,
	id_banco int,
	id_factor int,
	id_tipo_factor int,
	valor int not null,
	id_proyecto int,
	constraint fk_id_banco foreign key(id_banco) references dim_banco_constructor(id_banco),
	constraint fk_id_factor foreign key(id_factor) references dim_factor(id_factor),
	constraint fk_id_tipo_factor foreign key(id_tipo_factor) references dim_tipo_factor(id_tipo_factor)
);

-- Llenado con valor inicial 0
-- BEGIN
insert into dim_banco_factor (id_banco, id_factor, id_tipo_factor, valor)
select 
	b.id_banco,
	f.id_factor,
	t.id_tipo_factor,
	0 as valor
from 
	dim_banco_constructor b
cross join 
	dim_factor f
cross join 
	dim_tipo_factor t;

create table dim_grupo_img(
	id_grupo_img int primary key auto_increment,
	is_active bit default 1,
	grupo varchar(50) not null unique,
	orden int not null
);
create table dim_instructivo(
	id_instructivo int primary key auto_increment,
	instructivo varchar(50) not null unique,
	is_active bit default 1,
	procedimiento text,
	documentacion_cierre text,
	notas text
);
create table dim_categoria_medio(
	id_categoria int primary key auto_increment,
	categoria varchar(200) not null unique,
	codigo varchar(10),
	is_active bit default 1,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user
);
create table dim_medio_publicitario(
	id_medio int primary key auto_increment,
	medio varchar(200) not null unique,
	id_categoria int,
	id_sinco varchar(50) not null,
	codigo varchar(10),
	is_active bit default 1,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user,
	constraint fk_id_categoria foreign key(id_categoria) references dim_categoria_medio(id_categoria)
);
create table dim_tramite(
	id_tramite int primary key auto_increment,
	tramite varchar(200) not null unique,
	texto text,
	codigo varchar(10),
	is_active bit default 1,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user
);
insert into dim_tramite(tramite) values('Asesoría Firma Digital Documentos por Docusign');
insert into dim_tramite(tramite) values('Asesoría Pago con Cupón');
insert into dim_tramite(tramite) values('Asesoría Pago por PSE');
insert into dim_tramite(tramite) values('Cesión');
insert into dim_tramite(tramite) values('Consulta Fecha de Entrega del Apartamento');
insert into dim_tramite(tramite) values('Créditos');
insert into dim_tramite(tramite) values('Descargar cupón de pago');
insert into dim_tramite(tramite) values('Entrega Documentos');
insert into dim_tramite(tramite) values('Entrega Escritura Cliente');
insert into dim_tramite(tramite) values('Estado de cuenta');
insert into dim_tramite(tramite) values('Firma de Promesa');
insert into dim_tramite(tramite) values('Otrosí');
insert into dim_tramite(tramite) values('Solicitud Cliente Cambio Plan de Pagos');
insert into dim_tramite(tramite) values('Solicitud de Reformas');
insert into dim_tramite(tramite) values('Solicitud Posventa');
insert into dim_tramite(tramite) values('Subsidio');

create table dim_subsidio_vis(
	id_subsidio int primary key auto_increment,
	is_active bit default 1,
	periodo int not null unique,
	smmlv decimal(20,2) not null,
	smmlv_0_2 decimal(20,2) not null,
	smmlv_2_4 decimal(20,2) not null,
	imagen varchar(255)
);
insert into dim_subsidio_vis(periodo,smmlv,smmlv_0_2,smmlv_2_4) values(2025,1423500.00,42705000.00,28470000.00);

create table dim_documento(
	id_documento int primary key auto_increment,
	documento varchar(200) not null unique,
	codigo varchar(10),
	is_active bit default 1,
	is_img bit default 0,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user
);
insert into dim_documento (documento, is_active, is_img) values
('General', 1, 1),
('Sostenibilidad', 1, 1),
('Principal',1,1),
('Imágenes',1,1),
('Avances de obra',1,1);

create table dim_documento_archivo(
	id_archivo int primary key auto_increment,
	nombre varchar(200) not null,
	codigo varchar(50) not null unique,
	orden int not null,
	id_documento int,
	id_proyecto int,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user,
	constraint fk_id_documento foreign key(id_documento) references dim_documento(id_documento),
	unique(nombre, id_documento, id_proyecto)
);
-- END
/*

drop table fact_roles_usuarios;
drop table fact_permisos_roles;
drop table fact_roles;
drop table dim_permiso;
drop table fact_usuarios;
drop table dim_cargo;
drop table dim_zona;
drop table AuditoriaSQL;
*/

create table dim_grupo_proyecto(
	id_grupo_proyecto int primary key auto_increment,
	grupo varchar(50) not null,
	orden int not null,
	id_proyecto int,
	modulo varchar(200), -- ('imagenes','videos','recorridos','obras')
	is_active bit default 1,
	constraint fk_id_proyecto foreign key(id_proyecto) references fact_proyectos(id_proyecto),
	unique(grupo, id_proyecto)
);
create trigger tr_insert_grupo_proyecto_g after insert on dim_grupo_img for each row
begin
	insert into dim_grupo_proyecto(grupo, orden, id_proyecto, modulo)
	select new.grupo as grupo, new.orden as orden, fp.id_proyecto, 'imagenes' from fact_proyectos fp;
end;
create trigger tr_insert_grupo_proyecto_p after insert on fact_proyectos for each row
begin
	insert into dim_grupo_proyecto(grupo, orden, id_proyecto, modulo)
	select dg.grupo, dg.orden, new.id_proyecto as id_proyecto, 'imagenes' from dim_grupo_img dg;
end;

create table dim_sala_venta(
	id_sala_venta int primary key auto_increment,
	sala_venta varchar(200) not null unique,
	encuesta_vpn varchar(200),
	id_sede int not null,
	id_playlist varchar(200),
	codigo varchar(10),
	is_active bit default 1,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user,
    constraint fk_sala_sede foreign key (id_sede) 
        references dim_sede(id_sede)
);

create table dim_preferencias_usuario(
	id int primary key auto_increment,
	id_usuario int,
	created_on datetime default current_timestamp,
	nombre varchar(200) not null,
	valor text not null,
	constraint fk_id_usuario_preferencia foreign key(id_usuario) references fact_usuarios(id_usuario),
	constraint unique_usuario_preferencia unique(id_usuario, nombre)
);
create table dim_color(
	id_color int primary key auto_increment,
	estado varchar(50) not null unique,
	color varchar(7) not null,
	is_active bit default 1,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user
);

create table dim_tipo_turno(
	id_tipo_turno int primary key auto_increment,
	tipo_turno varchar(50) not null unique
);
create table dim_tipo_turno_sala(
	id_tipo_turno int not null references dim_tipo_turno(id_tipo_turno),
	id_sala_venta int not null references dim_sala_venta(id_sala_venta),
	primary key(id_tipo_turno, id_sala_venta)
);
insert into dim_tipo_turno (tipo_turno) values
('Atención con turnos'), ('Turnos con SMS'), ('Fichos físicos');

create table dim_campo_obligatorio(
	id_campo int primary key auto_increment,
	campo varchar(50) not null,
	modulo varchar(10) not null,
	campobd varchar(50) not null
);
create table dim_campo_obligatorio_sala(
	id_campo int not null references dim_campo_obligatorio(id_campo),
	id_sala_venta int not null references dim_sala_venta(id_sala_venta),
	primary key(id_campo, id_sala_venta)
);
insert into dim_campo_obligatorio(campo,modulo,campobd) values
('Dirección', 1, 'direccion'), 
('Medio publicitario', 2, 'id_medio'), 
('Presupuesto', 2, 'id_presupuesto_vivienda'), 
('Motivo de compra', 2, 'id_motivo_compra');

create table dim_personal_sala(
	id_sala_venta int not null references dim_sala_venta(id_sala_venta),
	id_usuario int not null references fact_usuarios(id_usuario),
	permanente bit default 0,
	primary key(id_sala_venta, id_usuario)
);
create table dim_hito_sala(
	id_hito int primary key auto_increment,
	titulo varchar(200) not null,
	descripcion varchar(255),
	fecha datetime not null,
	color varchar(7) not null,
	festivo bit default 0,
	id_sala_venta int not null references dim_sala_venta(id_sala_venta),
	id_proyecto int references fact_proyectos(id_proyecto)
);