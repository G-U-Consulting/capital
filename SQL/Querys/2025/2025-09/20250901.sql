create table dim_veto_cliente(
    id_veto int primary key auto_increment,
    fecha datetime default current_timestamp,
    id_cliente int not null unique references fact_clientes(id_cliente),
    motivo text,
    solicitado_por varchar(50) not null,
    vetado_por varchar(50),
    vigente bit default 0
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