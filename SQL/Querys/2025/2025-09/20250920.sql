create table if not exists log_cotizaciones_eliminadas (
    id_log int AUTO_INCREMENT primary key,
    id_negocios_unidades int,
    id_cliente int,
    id_proyecto int,
    cotizacion varchar(50),
    descripcion varchar(255),
    importe decimal(18,2),
    created_on datetime,
    isOpcion tinyint(1),
    usuario_crea varchar(100),
    eliminado_en datetime default now(),
    motivo varchar(255)
);


set global event_scheduler = on;

delimiter $$

create event if not exists eliminar_cotizaciones_expiradas
on schedule every 1 minute
do
begin

    insert into log_cotizaciones_eliminadas (
        id_negocios_unidades,
        id_cliente,
        id_proyecto,
        cotizacion,
        descripcion,
        importe,
        created_on,
        isOpcion,
        usuario_crea,
        motivo
    )
    select
        id_negocios_unidades,
        id_cliente,
        id_proyecto,
        cotizacion,
        descripcion,
        importe,
        created_on,
        isOpcion,
        usuario_crea,
        'Eliminada automáticamente por superar 30 minutos sin opción'
    from fact_negocios_unidades
    where date(created_on) = CURDATE()
      and TIMESTAMPDIFF(minute, created_on, now()) >= 30
      and (isOpcion is null or isOpcion = 0);


    delete from fact_negocios_unidades
    where date(created_on) = CURDATE()
      and TIMESTAMPDIFF(minute, created_on, now()) >= 30
      and (isOpcion is null or isOpcion = 0);
end$$

delimiter;
