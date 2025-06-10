
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


/*
drop table fact_clientes;
*/




