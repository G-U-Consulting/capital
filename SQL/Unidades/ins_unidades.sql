-- =============================================
-- Proceso: /
-- =============================================
--START_PARAM
set @id_proyecto = 1,
    @unidades = '{}',
    @Usuario = '';
--END_PARAM
drop table if exists tmp_unidades;
create temporary table tmp_unidades as(
    select *, convert(null, int) as id_torre, convert(null, int) as id_cuenta_convenio, convert(null, int) as id_unidad
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
        cerca_porteria varchar(50) path '$."cerca_porteria"',
        cerca_juegos_infantiles varchar(50) path '$."cerca_juegos_infantiles"',
        cerca_piscina varchar(50) path '$."cerca_piscina"',
        tiene_balcon varchar(50) path '$."tiene_balcon"',
        tiene_parq_sencillo varchar(50) path '$."tiene_parq_sencillo"',
        tiene_parq_doble varchar(50) path '$."tiene_parq_doble"',
        tiene_deposito varchar(50) path '$."tiene_deposito"',
        tiene_acabados varchar(50) path '$."tiene_acabados"'
    ))  as a
);
-- TODO hacer validación de datos antes de continuar
insert into fact_torres(id_proyecto, nombre_torre, consecutivo, orden_salida, aptos_piso, created_by)
select distinct @id_proyecto, concat('Torre ', torre), torre, torre, 
    (select count(*) from tmp_unidades t where a.torre = t.torre and a.piso = t.piso), @usuario
from tmp_unidades a
    left join fact_torres b on b.id_proyecto = @id_proyecto and a.torre = b.consecutivo
where b.id_torre is null;

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

insert into fact_unidades(
	id_proyecto, id_torre, id_estado_unidad, nombre_unidad, numero_apartamento, piso, tipo, codigo_planta, localizacion, observacion_apto, fecha_fec,
	fecha_edi, fecha_edi_mostrar, inv_terminado, num_alcobas, num_banos, area_privada_cub, area_privada_lib, area_total, acue, area_total_mas_acue,
	valor_separacion, valor_acabados, valor_reformas, valor_descuento, pate, id_cuenta_convenio, asoleacion, altura, id_lista, cerca_porteria, 
    cerca_juegos_infantiles, cerca_piscina, tiene_balcon, tiene_parq_sencillo, tiene_parq_doble, tiene_deposito, tiene_acabados, created_by 
) select distinct
    @id_proyecto as id_proyecto,
	t.id_torre as id_torre,
	(select e.id_estado_unidad 
        from dim_estado_unidad e 
        where e.estado_unidad = t.estatus) as id_estado_unidad,
	concat('Apto ', t.apartamento) as nombre_unidad,
	convert(t.apartamento, int) as numero_apartamento,
	convert(t.piso, int) as piso,
	t.tipo as tipo,
	if(t.codigo_planta is null or t.codigo_planta = '', t.tipo, t.codigo_planta) as codigo_planta,
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
	@usuario as created_by
from tmp_unidades t;

select 'OK' as respuesta;
