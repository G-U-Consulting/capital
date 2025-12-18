-- =============================================
-- Ejecutar una vez en la base de datos para corregir cotizaciones duplicadas y prevenir duplicados.
-- =============================================

set @proyecto_id = NULL;
set @cliente_id = NULL;
set @nuevo_consecutivo = 0;

update fact_cotizaciones fc1
inner join (
    select
        id_cliente,
        id_proyecto,
        cotizacion,
        count(*) as duplicados,
        min(id_cotizacion) as primera_id
    from fact_cotizaciones
    where id_proyecto is not null
      and id_cliente is not null
    group by id_cliente, id_proyecto, cotizacion
    having count(*) > 1
) duplicados on fc1.id_cliente = duplicados.id_cliente
    and fc1.id_proyecto = duplicados.id_proyecto
    and fc1.cotizacion = duplicados.cotizacion
    and fc1.id_cotizacion != duplicados.primera_id
set fc1.cotizacion = concat(
    (select coalesce(max(cast(fc2.cotizacion as unsigned)), 0)
     from fact_cotizaciones fc2
     where fc2.id_cliente = fc1.id_cliente
       and fc2.id_proyecto = fc1.id_proyecto
       and fc2.id_cotizacion < fc1.id_cotizacion) +
       row_number() over (partition by fc1.id_cliente, fc1.id_proyecto, fc1.cotizacion order by fc1.id_cotizacion)
);

alter table fact_cotizaciones
add unique key uk_cotizacion_cliente_proyecto (id_cliente, id_proyecto, cotizacion);

select
    id_cliente,
    id_proyecto,
    cotizacion,
    count(*) as cantidad
from fact_cotizaciones
where id_proyecto is not null
  and id_cliente is not null
group by id_cliente, id_proyecto, cotizacion
having count(*) > 1;



create table dim_certificacion (
    id_certificacion int not null AUTO_INCREMENT,
    certificacion varchar(200) not null unique,
    codigo varchar(10),
    is_active BIT default 1,
    created_on DATETIME default current_timestamp,
    created_by varchar(200) default CURRENT_USER,
    constraint pk_dim_certificacion primary key (id_certificacion)
) ENGINE=InnoDB default CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


alter table fact_proyectos
add column id_certificacion int null AFTER id_estado_publicacion,
add constraint fk_proyecto_certificacion foreign key (id_certificacion)
    references dim_certificacion(id_certificacion)
    on delete set null
    on update cascade;


insert into dim_certificacion (certificacion, is_active) values
('Próxima Certificación Edge', 1),
('Vigente Certificación Edge', 1),
('Ya tiene Certificación Edge', 1),
('Ya tiene Certificación Edge-Advanced', 1);
