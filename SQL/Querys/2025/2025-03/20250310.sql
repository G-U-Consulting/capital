create table dim_zona(
	id_zona int not null,
	zona varchar(100),
	alias varchar(2),
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user,
	constraint id_zona primary key(id_zona)
);
insert into dim_zona(id_zona, zona, alias)
select 1, 'Zona Asesores','ZA';
create table fact_usuarios(
	id_usuario int not null auto_increment,
	usuario varchar(200),
	identificacion varchar(20),
	nombres varchar(200),
	email varchar(200),
	is_active bit default 1,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user,
	constraint pk_id_usuario primary key(id_usuario)
);
--drop table dim_permiso
create table dim_permiso(
	id_permiso int not null,
	permiso varchar(200),
	grupo varchar(200),
	is_active bit default 1,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user,
	constraint pk_id_permiso primary key(id_permiso)
);
insert into dim_permiso(id_permiso, permiso, grupo) values
(1, 'Visualización de usuarios', 'Administración de Usuarios'),
(2, 'Creación de usuarios', 'Administración de Usuarios'),
(3, 'Edición de usuarios', 'Administración de Usuarios'),
(4, 'Visualización de roles', 'Administración de Roles'),
(5, 'Creación de roles', 'Administración de Roles'),
(6, 'Edición de roles', 'Administración de Roles')

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

select *
from fact_permisos_roles
select *
from fact_roles
truncate table fact_permisos_roles
delete from fact_roles