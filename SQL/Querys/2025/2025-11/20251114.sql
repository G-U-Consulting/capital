create table cola_tareas_rpa (
  id_cola_tareas_rpa int primary key auto_increment,
  tipo varchar(30),
  sub_tipo varchar(30),
  prioridad decimal(10, 2),
  llave varchar(20),
  datos varchar(1000),
  is_active bit not null default 1,
  created_by varchar(200) default current_user,
  created_on datetime not null default current_timestamp,
  fecha_programada datetime not null default current_timestamp,
  requested_on datetime,
  requested_times int not null default 0,
  resultado varchar(255),
  updated_on datetime default null on update current_timestamp
);

create table dim_log_salesforce(
  id_log int primary key auto_increment,
  id_cola_tareas_rpa int not null unique references cola_tareas_rpa(id_cola_tareas_rpa),
  sincronizada bit not null
);

create table dim_lista_restrictiva(
  id_lista int primary key auto_increment,
  id_opcion int not null references fact_opcion(id_opcion),
  id_cliente int not null references fact_clientes(id_cliente),
  created_on datetime default current_timestamp,
  resultados text,
  is_active bit default 1,
  unique(id_opcion, id_cliente)
);