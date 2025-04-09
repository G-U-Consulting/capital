create table dim_sede(
	id_sede int not null,
	sede varchar(100),
	alias varchar(3),
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user
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
	identificacion varchar(20),
	nombres varchar(200),
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
	descripcion varchar(1000),
	is_active bit default 1,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user,
	constraint pk_id_rol primary key(id_rol)
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

/*
drop table fact_roles_usuarios;
drop table fact_permisos_roles;
drop table fact_roles;
drop table dim_permiso;
drop table fact_usuarios;
drop table dim_cargo;
drop table dim_zona;
*/