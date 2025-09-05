create table dim_veto_cliente(
    id_veto int primary key auto_increment,
    fecha datetime default current_timestamp,
    id_cliente int not null unique references fact_clientes(id_cliente),
    motivo text,
    solicitado_por varchar(50) not null,
    vetado_por varchar(50),
    vigente bit default 0,
    id_tarea int references dim_tarea_usuario(id_tarea)
);
create trigger tr_update_veto_cliente after update on dim_veto_cliente for each row
begin
    if new.vigente = 1 then
	    update fact_clientes set is_vetado = 1 where id_cliente = new.id_cliente;
    end if;
end;
create trigger tr_delete_veto_cliente after delete on dim_veto_cliente for each row
begin
	update fact_clientes set is_vetado = 0 where id_cliente = old.id_cliente;
end;

create table dim_categoria_desistimiento(
    id_categoria int primary key auto_increment,
    categoria varchar(200) not null unique
);
insert into dim_categoria_desistimiento(categoria) values
('CALAMIDAD DOMÉSTICA'), 
('CARTERA EN MORA'), 
('CREDITO NEGADO / NO TRAMITADO'), 
('DISMINUCION DE INGRESOS'), 
('FALLECIMIENTO'), 
('INCUMPLIMIENTO EN TRAMITES'), 
('NO CERRO NEGOCIO'), 
('PERDIDA DE EMPLEO'), 
('TRÁMITES'), 
('TRASLADO DE PROYECTO'), 
('VOLUNTAD PROPIA"');

create table dim_penalidad_desistimiento(
    id_penalidad int primary key auto_increment,
    penalidad varchar(200) not null unique,
    campo varchar(50)
);
insert into dim_penalidad_desistimiento(penalidad, campo) values
('Sí (Cálculo automático)', NULL), 
('Sí (Cálculo manual)', 'Monto'), 
('Sí (Por porcentaje)', 'Porcentaje'), 
('No, Sin Penalidad', NULL), 
('No (Devolución total)', NULL);