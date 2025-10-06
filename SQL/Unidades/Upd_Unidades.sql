-- =============================================
-- Proceso: Unidades/Upd_Unidades
-- =============================================
--START_PARAM
set @id_proyecto = NULL,
    @unidades = '',
    @Usuario = '';
--END_PARAM
drop table if exists tmp_unidades;
create temporary table tmp_unidades as(
    select *, convert(null, int) as id_torre, convert(null, int) as id_cuenta_convenio, convert(null, int) as id_unidad, 
    convert(null, int) as id_parqueadero, convert(null, int) as id_parqueadero2, convert(null, int) as id_deposito
    from json_table(@unidades, '$[*].pisos[*].unidades[*]' columns( 
        apartamento varchar(50) path '$."apartamento"',
        torre varchar(50) path '$."torre"',
        piso varchar(50) path '$."piso"',
        estatus varchar(50) path '$."estatus"',
        tipo varchar(50) path '$."tipo"',
        codigo_planta varchar(50) path '$."codigo_planta"',
        localizacion varchar(50) path '$."localizacion"',
        observacion_apto varchar(500) path '$."observacion_apto"',
        fecha_fec varchar(50) path '$."fecha_fec"',
        fecha_edi varchar(50) path '$."fecha_edi"',
        fecha_edi_mostrar varchar(50) path '$."fecha_edi_mostrar"',
        inv_terminado varchar(50) path '$."inv_terminado"',
        num_alcobas varchar(50) path '$."num_alcobas"',
        num_banos varchar(50) path '$."num_banos"',
        area_privada_cub varchar(50) path '$."area_privada_cub"',
        area_privada_lib varchar(50) path '$."area_privada_lib"',
        area_total varchar(50) path '$."area_total"',
        acue varchar(50) path '$."acue"',
        area_total_mas_acue varchar(50) path '$."area_total_mas_acue"',
        lista varchar(50) path '$."lista"',
        valor_separacion varchar(50) path '$."valor_separacion"',
        valor_acabados varchar(50) path '$."valor_acabados"',
        valor_reformas varchar(50) path '$."valor_reformas"',
        valor_descuento varchar(50) path '$."valor_descuento"',
        pate varchar(50) path '$."pate"',
        cuenta_tipo varchar(50) path '$."cuenta_tipo"',
        cuenta_numero varchar(50) path '$."cuenta_numero"',
        convenio varchar(50) path '$."convenio"',
        cuota_inicial_banco varchar(50) path '$."cuota_inicial_banco"',
        ean varchar(50) path '$."ean"',
        asoleacion varchar(50) path '$."asoleacion"',
        altura varchar(50) path '$."altura"',
        clase varchar(50) path '$."clase"',
        cerca_porteria varchar(50) path '$."cerca_porteria"',
        cerca_juegos_infantiles varchar(50) path '$."cerca_juegos_infantiles"',
        cerca_piscina varchar(50) path '$."cerca_piscina"',
        tiene_balcon varchar(50) path '$."tiene_balcon"',
        tiene_parq_sencillo varchar(50) path '$."tiene_parq_sencillo"',
        tiene_parq_doble varchar(50) path '$."tiene_parq_doble"',
        tiene_deposito varchar(50) path '$."tiene_deposito"',
        tiene_acabados varchar(50) path '$."tiene_acabados"',

        parqueadero varchar(50) path '$."parqueadero"',
        parqueadero_area varchar(50) path '$."parqueadero_area"',
        parqueadero_ubicacion varchar(50) path '$."parqueadero_ubicacion"',
        valor_parqueadero varchar(50) path '$."valor_parqueadero"',
        parqueadero2 varchar(50) path '$."parqueadero2"',
        parqueadero2_area varchar(50) path '$."parqueadero2_area"',
        parqueadero2_ubicacion varchar(50) path '$."parqueadero2_ubicacion"',
        valor_parqueadero2 varchar(50) path '$."valor_parqueadero2"',
        deposito varchar(50) path '$."deposito"',
        deposito_area varchar(50) path '$."deposito_area"',
        deposito_ubicacion varchar(50) path '$."deposito_ubicacion"',
        valor_deposito varchar(50) path '$."valor_deposito"'
    ))  as a
    where a.apartamento is not null and a.apartamento != '' 
        and a.torre is not null and a.torre != '' 
        and a.clase is not null and a.clase != ''
);

-- TODO hacer validación de datos antes de continuar
INSERT INTO fact_torres(id_proyecto, nombre_torre, consecutivo, orden_salida, aptos_piso, created_by)
SELECT 
    @id_proyecto,
    CONCAT('Torre ', datos.torre),
    datos.torre,
    CAST(datos.torre AS UNSIGNED),
    datos.max_aptos,
    @usuario
FROM (
    SELECT 
        t.torre,
        MAX(t.cantidad) AS max_aptos
    FROM (
        SELECT torre, piso, COUNT(*) AS cantidad
        FROM tmp_unidades
        GROUP BY torre, piso
    ) AS t
    GROUP BY t.torre
) AS datos
LEFT JOIN fact_torres b 
    ON b.id_proyecto = @id_proyecto AND datos.torre = b.consecutivo
WHERE b.id_torre IS NULL;



UPDATE fact_torres a
JOIN (
    SELECT torre, MAX(aptos_por_piso) AS max_aptos
    FROM (
        SELECT torre, piso, COUNT(*) AS aptos_por_piso
        FROM tmp_unidades
        GROUP BY torre, piso
    ) AS pisos
    GROUP BY torre
) AS resumen ON a.consecutivo = resumen.torre
SET a.aptos_piso = resumen.max_aptos,
    a.orden_salida = a.consecutivo
WHERE a.id_proyecto = @id_proyecto;

update fact_torres set aptos_fila = aptos_piso where id_proyecto = @id_proyecto;

update tmp_unidades a
    join fact_torres b on a.torre = b.consecutivo
set 
    a.id_torre = b.id_torre
where b.id_proyecto = @id_proyecto;


insert into dim_cuenta_convenio(cuenta_tipo, cuenta_numero, convenio, cuota_inicial_banco, ean, created_by)
select distinct a.cuenta_tipo, a.cuenta_numero, a.convenio, a.cuota_inicial_banco, a.ean, @created_by
from tmp_unidades a
    left join dim_cuenta_convenio b on 
        a.cuenta_tipo = b.cuenta_tipo and a.cuenta_numero = b.cuenta_numero and a.convenio = b.convenio
            and a.cuota_inicial_banco = b.cuota_inicial_banco and a.ean = b.ean
where b.id_cuenta_convenio is null;

update tmp_unidades a
    join dim_cuenta_convenio b on a.cuenta_tipo = b.cuenta_tipo and a.cuenta_numero = b.cuenta_numero and a.convenio = b.convenio
            and a.cuota_inicial_banco = b.cuota_inicial_banco and a.ean = b.ean
set 
    a.id_cuenta_convenio = b.id_cuenta_convenio;

insert into dim_lista_precios(lista, id_proyecto, updated_by)
select t.lista, @id_proyecto, @Usuario 
from tmp_unidades t 
left join dim_lista_precios l on t.lista = l.lista and l.id_proyecto = @id_proyecto
where l.id_lista is null
group by t.lista
on duplicate key update
    updated_on = current_timestamp, 
    updated_by = @Usuario;

insert ignore into dim_tipo_unidad(tipo, id_proyecto)
select if(t.codigo_planta is null or t.codigo_planta = '', t.tipo, t.codigo_planta), @id_proyecto
from tmp_unidades t;

insert ignore into dim_lista_tipo_torre(id_torre, id_tipo)
select ft.id_torre, tu.id_tipo 
from fact_torres ft, dim_tipo_unidad tu 
where ft.id_proyecto = @id_proyecto and tu.id_proyecto = @id_proyecto;

select coalesce(codigo, 'APT') into @cod_apt from dim_tipo_proyecto where id_tipo_proyecto = 8;
insert into fact_unidades(
    id_proyecto, id_torre, id_estado_unidad, nombre_unidad, numero_apartamento, piso, tipo, codigo_planta, id_tipo, localizacion, observacion_apto, fecha_fec,
    fecha_edi, fecha_edi_mostrar, inv_terminado, num_alcobas, num_banos, area_privada_cub, area_privada_lib, area_total, acue, area_total_mas_acue,
    valor_separacion, valor_acabados, valor_reformas, valor_descuento, pate, id_cuenta_convenio, asoleacion, altura, id_clase, id_lista, cerca_porteria, 
    cerca_juegos_infantiles, cerca_piscina, tiene_balcon, tiene_parq_sencillo, tiene_parq_doble, tiene_deposito, tiene_acabados, created_by 
) 
select distinct
    @id_proyecto as id_proyecto,
    t.id_torre as id_torre,
    (select e.id_estado_unidad 
        from dim_estado_unidad e 
        where e.estado_unidad = t.estatus) as id_estado_unidad,
    concat(if(t.clase is not null and t.clase != '', 
        (select coalesce(tp.codigo, @cod_apt) 
            from dim_tipo_proyecto tp 
            where tp.tipo_proyecto = t.clase), @cod_apt), ' ', t.apartamento) as nombre_unidad,
    convert(t.apartamento, int) as numero_apartamento,
    convert(t.piso, int) as piso,
    t.tipo as tipo,
    if(t.codigo_planta is null or t.codigo_planta = '', t.tipo, t.codigo_planta) as codigo_planta,
    (select tu.id_tipo from dim_tipo_unidad tu where tu.tipo = 
        if(t.codigo_planta is null or t.codigo_planta = '', t.tipo, t.codigo_planta) and tu.id_proyecto = @id_proyecto) as id_tipo,
    t.localizacion as localizacion,
    left(t.observacion_apto, 500) as observacion_apto,
    convert(t.fecha_fec, date) as fecha_fec,
    convert(t.fecha_edi, date) as fecha_edi,
    convert(t.fecha_edi_mostrar, date) as fecha_edi_mostrar,
    convert(t.inv_terminado, unsigned) as inv_terminado,
    convert(t.num_alcobas, int) as num_alcobas,
    convert(t.num_banos, int) as num_banos,
    convert(t.area_privada_cub, decimal(20, 2)) as area_privada_cub,
    convert(t.area_privada_lib, decimal(20, 2)) as area_privada_lib,
    convert(t.area_total, decimal(20, 2)) as area_total,
    convert(t.acue, decimal(20, 2)) as acue,
    convert(t.area_total_mas_acue, decimal(20, 2)) as area_total_mas_acue,
    convert(t.valor_separacion, decimal(20, 2)) as valor_separacion,
    convert(t.valor_acabados, decimal(20, 2)) as valor_acabados,
    convert(t.valor_reformas, decimal(20, 2)) as valor_reformas,
    convert(t.valor_descuento, decimal(20, 2)) as valor_descuento,
    t.pate as pate,
    t.id_cuenta_convenio as id_cuenta_convenio,
    t.asoleacion as asoleacion,
    t.altura as altura,
    if(t.clase is null or t.clase = '', null, 
        (select tp.id_tipo_proyecto from dim_tipo_proyecto tp where tp.tipo_proyecto = clase)) as id_clase,
    if(t.lista is null or t.lista = '', null, 
        (select l.id_lista from dim_lista_precios l where l.lista = t.lista and l.id_proyecto = @id_proyecto)) as id_lista,
    convert(t.cerca_porteria, unsigned) as cerca_porteria,
    convert(t.cerca_juegos_infantiles, unsigned) as cerca_juegos_infantiles,
    convert(t.cerca_piscina, unsigned) as cerca_piscina,
    convert(t.tiene_balcon, unsigned) as tiene_balcon,
    convert(t.tiene_parq_sencillo, unsigned) as tiene_parq_sencillo,
    convert(t.tiene_parq_doble, unsigned) as tiene_parq_doble,
    convert(t.tiene_deposito, unsigned) as tiene_deposito,
    convert(t.tiene_acabados, unsigned) as tiene_acabados,
    @Usuario as created_by
from tmp_unidades t
on duplicate key update
    id_estado_unidad = values(id_estado_unidad),
    nombre_unidad = values(nombre_unidad),
    piso = values(piso),
    tipo = values(tipo),
    codigo_planta = values(codigo_planta),
    id_tipo = values(id_tipo),
    localizacion = values(localizacion),
    observacion_apto = values(observacion_apto),
    fecha_fec = values(fecha_fec),
    fecha_edi = values(fecha_edi),
    fecha_edi_mostrar = values(fecha_edi_mostrar),
    inv_terminado = values(inv_terminado),
    num_alcobas = values(num_alcobas),
    num_banos = values(num_banos),
    area_privada_cub = values(area_privada_cub),
    area_privada_lib = values(area_privada_lib),
    area_total = values(area_total),
    acue = values(acue),
    area_total_mas_acue = values(area_total_mas_acue),
    valor_separacion = values(valor_separacion),
    valor_acabados = values(valor_acabados),
    valor_reformas = values(valor_reformas),
    valor_descuento = values(valor_descuento),
    pate = values(pate),
    id_cuenta_convenio = values(id_cuenta_convenio),
    asoleacion = values(asoleacion),
    altura = values(altura),
    id_clase = values(id_clase),
    id_lista = values(id_lista),
    cerca_porteria = values(cerca_porteria),
    cerca_juegos_infantiles = values(cerca_juegos_infantiles),
    cerca_piscina = values(cerca_piscina),
    tiene_balcon = values(tiene_balcon),
    tiene_parq_sencillo = values(tiene_parq_sencillo),
    tiene_parq_doble = values(tiene_parq_doble),
    tiene_deposito = values(tiene_deposito),
    tiene_acabados = values(tiene_acabados),
    updated_by = @Usuario,
    updated_on = current_timestamp;

update tmp_unidades a
    join fact_unidades b on a.id_torre = b.id_torre and a.apartamento = b.numero_apartamento and b.id_proyecto = @id_proyecto
set 
    a.id_unidad = b.id_unidad;

select tp.codigo into @cod_clase_prq
from dim_tipo_proyecto tp where tp.id_tipo_proyecto = 13;
insert into fact_unidades(id_proyecto, id_torre, nombre_unidad, numero_apartamento, piso, area_total, valor_complemento, id_clase)
select 
    @id_proyecto as id_proyecto,
    t.id_torre as id_torre,
    concat(coalesce(@cod_clase_prq, ''), ' ', t.parqueadero) as nombre_unidad,
    convert(t.parqueadero, int) as numero_apartamento,
    convert(t.parqueadero_ubicacion, int) as piso,
    convert(t.parqueadero_area, decimal(20, 2)) as area_total,
    convert(t.valor_parqueadero, decimal(20, 2)) as valor_complemento,
    13 as id_clase
from tmp_unidades t
where t.parqueadero is not null and t.parqueadero != '' and t.parqueadero != '0'
on duplicate key update
    id_torre = values(id_torre),
    nombre_unidad = values(nombre_unidad),
    numero_apartamento = values(numero_apartamento),
    piso = values(piso),
    valor_complemento = values(valor_complemento),
    id_clase = values(id_clase);
update tmp_unidades a
    join fact_unidades b on a.id_torre = b.id_torre and a.parqueadero = b.numero_apartamento and b.id_proyecto = @id_proyecto and b.id_clase = 13
set 
    a.id_parqueadero = b.id_unidad;

insert into fact_unidades(id_proyecto, id_torre, nombre_unidad, numero_apartamento, piso, area_total, valor_complemento, id_clase)
select 
    @id_proyecto as id_proyecto,
    t.id_torre as id_torre,
    concat(coalesce(@cod_clase_prq, ''), ' ', t.parqueadero2) as nombre_unidad,
    convert(t.parqueadero2, int) as numero_apartamento,
    convert(t.parqueadero2_ubicacion, int) as piso,
    convert(t.parqueadero2_area, decimal(20, 2)) as area_total,
    convert(t.valor_parqueadero2, decimal(20, 2)) as valor_complemento,
    13 as id_clase
from tmp_unidades t
where t.parqueadero2 is not null and t.parqueadero2 != '' and t.parqueadero2 != '0'
on duplicate key update
    id_torre = values(id_torre),
    nombre_unidad = values(nombre_unidad),
    numero_apartamento = values(numero_apartamento),
    piso = values(piso),
    valor_complemento = values(valor_complemento),
    id_clase = values(id_clase);
update tmp_unidades a
    join fact_unidades b on a.id_torre = b.id_torre and a.parqueadero2 = b.numero_apartamento and b.id_proyecto = @id_proyecto and b.id_clase = 13
set 
    a.id_parqueadero2 = b.id_unidad;

select tp.codigo into @cod_clase_dep
from dim_tipo_proyecto tp where tp.id_tipo_proyecto = 15;
insert into fact_unidades(id_proyecto, id_torre, nombre_unidad, numero_apartamento, piso, area_total, valor_complemento, id_clase)
select 
    @id_proyecto as id_proyecto,
    t.id_torre as id_torre,
    concat(coalesce(@cod_clase_dep, ''), ' ', t.deposito) as nombre_unidad,
    convert(t.deposito, int) as numero_apartamento,
    convert(t.deposito_ubicacion, int) as piso,
    convert(t.deposito_area, decimal(20, 2)) as area_total,
    convert(t.valor_deposito, decimal(20, 2)) as valor_complemento,
    15 as id_clase
from tmp_unidades t
where t.deposito is not null and t.deposito != '' and t.deposito != '0'
on duplicate key update
    id_torre = values(id_torre),
    nombre_unidad = values(nombre_unidad),
    numero_apartamento = values(numero_apartamento),
    piso = values(piso),
    valor_complemento = values(valor_complemento),
    id_clase = values(id_clase);
update tmp_unidades a
    join fact_unidades b on a.id_torre = b.id_torre and a.deposito = b.numero_apartamento and b.id_proyecto = @id_proyecto and b.id_clase = 15
set 
    a.id_deposito = b.id_unidad;


insert into dim_agrupacion_unidad(id_proyecto, nombre, descripcion)
select @id_proyecto, 
    (select concat(tp.codigo, ' ', u.numero_apartamento, ' - T', ft.consecutivo) from fact_unidades u 
        join fact_torres ft on u.id_torre = ft.id_torre where u.id_unidad = t.id_unidad) as nombre,
    concat(
        (select concat(tp.codigo, ': ', u.numero_apartamento) from fact_unidades u where u.id_unidad = t.id_unidad),
        if(t.id_parqueadero is not null, (select concat(', ', coalesce(utp.codigo, ''), ': ', u.numero_apartamento) 
            from fact_unidades u left join dim_tipo_proyecto utp on u.id_clase = utp.id_tipo_proyecto
            where u.id_unidad = t.id_parqueadero), ''),
        if(t.id_parqueadero2 is not null, (select concat(', ', coalesce(utp.codigo, ''), ': ', u.numero_apartamento) 
            from fact_unidades u left join dim_tipo_proyecto utp on u.id_clase = utp.id_tipo_proyecto
            where u.id_unidad = t.id_parqueadero2), ''),
        if(t.id_deposito is not null, (select concat(', ', coalesce(utp.codigo, ''), ': ', u.numero_apartamento) 
            from fact_unidades u left join dim_tipo_proyecto utp on u.id_clase = utp.id_tipo_proyecto
            where u.id_unidad = t.id_deposito), '')
    ) as descripcion
from tmp_unidades t
left join dim_tipo_proyecto tp on t.clase = tp.tipo_proyecto
where (t.parqueadero is not null and t.parqueadero != '' and t.parqueadero != '0')
    or (t.parqueadero2 is not null and t.parqueadero2 != '' and t.parqueadero2 != '0')
    or (t.deposito is not null and t.deposito != '' and t.deposito != '0')
on duplicate key update
    nombre = values(nombre);

drop table if exists tmp_agrupaciones;
create temporary table tmp_agrupaciones as (
select (select concat(tp.codigo, ' ', u.numero_apartamento, ' - T', ft.consecutivo) from fact_unidades u 
        join fact_torres ft on u.id_torre = ft.id_torre where u.id_unidad = t.id_unidad) as grupo, 
    id_unidad, id_parqueadero, id_parqueadero2, id_deposito 
from tmp_unidades t
left join dim_tipo_proyecto tp on t.clase = tp.tipo_proyecto
where (t.parqueadero is not null and t.parqueadero != '' and t.parqueadero != '0')
    or (t.parqueadero2 is not null and t.parqueadero2 != '' and t.parqueadero2 != '0')
    or (t.deposito is not null and t.deposito != '' and t.deposito != '0')
); 

update fact_unidades u
join tmp_agrupaciones t on u.id_unidad in (t.id_unidad, t.id_parqueadero, t.id_parqueadero2, t.id_deposito)
set u.id_agrupacion = (
    select a.id_agrupacion
    from dim_agrupacion_unidad a
    where a.id_proyecto = @id_proyecto and a.nombre = t.grupo
)
where u.id_unidad in (t.id_unidad, t.id_parqueadero, t.id_parqueadero2, t.id_deposito)
    and u.id_proyecto = @id_proyecto;


select 'OK' as respuesta;



/*
select * from dim_agrupacion_unidad;
select * from fact_unidades where id_proyecto = 5 limit 2000;
select * from tmp_agrupaciones;
update fact_unidades set id_agrupacion = null where id_proyecto=1;
delete from dim_hito_cargo where id_hito in (select h.id_hito from fact_unidades u 
    join dim_hito_sala h on u.id_torre = h.id_torre where u.id_proyecto = 1 group by h.id_hito);
delete from dim_hito_sala where id_torre in (select id_torre from fact_torres where id_proyecto = 1);
delete from dim_agrupacion_unidad where id_proyecto=1;
delete from dim_lista_tipo_torre where id_torre in (select id_torre from fact_torres where id_proyecto = 1);
delete from dim_precio_unidad where id_unidad in (select id_unidad from fact_unidades where id_proyecto = 1);
delete from fact_unidades where id_proyecto = 1;
delete from fact_torres where id_proyecto = 1;
update fact_proyectos set id_lista = null where id_proyecto = 1;
delete from dim_lista_precios where id_proyecto=1;
*/
