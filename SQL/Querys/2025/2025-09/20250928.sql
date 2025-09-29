create table dim_planes_pago (
    id_planes_pago int auto_increment primary key,
    descripcion varchar(100),
    porcentaje_cuotas int,
    porcentaje_final int,
    is_active bit default 1,
	created_on datetime default current_timestamp,
	created_by varchar(200) default current_user
);


insert into dim_planes_pago (descripcion, porcentaje_cuotas, porcentaje_final) values
('Cuotas iguales', NULL, NULL),
('60% en cuotas iguales - 40% en cuota al final', 60, 40),
('70% en cuotas iguales - 30% en cuota al final', 70, 30),
('80% en cuotas iguales - 20% en cuota al final', 80, 20),
('1 cuota única del 100%', 100, 0);

