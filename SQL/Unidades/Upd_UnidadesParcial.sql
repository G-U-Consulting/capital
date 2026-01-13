-- =============================================
-- Proceso: Unidades/Upd_UnidadesParcial
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
        za1_id varchar(50) path '$."ID_apartamento"',
        salesforce_id varchar(50) path '$."salesforce_id"',
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
        encargo_fiduciario varchar(50) path '$."encargoFiduciario"',
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
        agrupacion varchar(50) path '$."agrupacion"',
        valor_complemento varchar(50) path '$."valor_complemento"'
    ))  as a
    where a.apartamento is not null and a.apartamento != '' 
        and a.torre is not null and a.torre != '' 
);
select tp.tipo_proyecto into @nom_clase_apt
from dim_tipo_proyecto tp where tp.id_tipo_proyecto = 8;
update tmp_unidades set clase = @nom_clase_apt where clase is null or trim(clase) = '';
alter table tmp_unidades
  add index idx_clase (clase);


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
    where t.torre is not null and trim(t.torre) <> ''
    GROUP BY t.torre
) AS datos
LEFT JOIN fact_torres b 
    ON b.id_proyecto = @id_proyecto AND datos.torre = b.consecutivo
WHERE b.id_torre IS NULL;

update tmp_unidades a join fact_torres b on a.torre = b.consecutivo
set a.id_torre = b.id_torre
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
set a.id_cuenta_convenio = b.id_cuenta_convenio;


insert into dim_lista_precios(lista, id_proyecto, updated_by)
select t.lista, @id_proyecto, @Usuario 
from tmp_unidades t 
where t.lista is not null and trim(t.lista) <> ''
group by t.lista
on duplicate key update
    updated_on = current_timestamp, 
    updated_by = @Usuario;


insert ignore into dim_tipo_unidad(tipo, id_proyecto)
select if(t.codigo_planta is null or trim(t.codigo_planta) = '', t.tipo, t.codigo_planta), @id_proyecto
from tmp_unidades t;

insert ignore into dim_props_tipo_torre(id_torre, id_tipo)
select ft.id_torre, tu.id_tipo 
from fact_torres ft, dim_tipo_unidad tu 
where ft.id_proyecto = @id_proyecto and tu.id_proyecto = @id_proyecto;


select coalesce(codigo, 'APT') into @cod_apt from dim_tipo_proyecto where id_tipo_proyecto = 8;

UPDATE fact_unidades u
JOIN tmp_unidades t ON t.apartamento = u.numero_apartamento
JOIN dim_tipo_proyecto tp ON TRIM(t.clase) = tp.tipo_proyecto AND tp.id_tipo_proyecto = u.id_clase
SET
    u.id_estado_unidad = CASE WHEN t.estatus IS NOT NULL AND TRIM(t.estatus) <> '' THEN (
        SELECT e.id_estado_unidad FROM dim_estado_unidad e WHERE e.estado_unidad = t.estatus
    ) ELSE u.id_estado_unidad END,
    u.nombre_unidad = CASE WHEN t.clase IS NOT NULL AND TRIM(t.clase) <> '' THEN CONCAT(COALESCE(tp.codigo, @cod_apt), ' ', t.apartamento) ELSE u.nombre_unidad END,
    u.za1_id = CASE WHEN t.za1_id IS NOT NULL AND TRIM(t.za1_id) <> '' THEN t.za1_id ELSE u.za1_id END,
    u.salesforce_id = CASE WHEN t.salesforce_id IS NOT NULL AND TRIM(t.salesforce_id) <> '' THEN t.salesforce_id ELSE u.salesforce_id END,
    u.piso = CASE WHEN t.piso IS NOT NULL AND TRIM(t.piso) <> '' THEN CONVERT(t.piso, SIGNED) ELSE u.piso END,
    u.tipo = CASE WHEN t.tipo IS NOT NULL AND TRIM(t.tipo) <> '' THEN t.tipo ELSE u.tipo END,
    u.codigo_planta = CASE WHEN t.codigo_planta IS NOT NULL AND TRIM(t.codigo_planta) <> '' THEN t.codigo_planta ELSE u.codigo_planta END,
    u.id_tipo = CASE WHEN (t.codigo_planta IS NOT NULL AND TRIM(t.codigo_planta) <> '') OR (t.tipo IS NOT NULL AND TRIM(t.tipo) <> '') THEN (
        SELECT tu.id_tipo FROM dim_tipo_unidad tu WHERE tu.tipo = IF(t.codigo_planta IS NULL OR TRIM(t.codigo_planta) = '', t.tipo, t.codigo_planta) AND tu.id_proyecto = @id_proyecto
    ) ELSE u.id_tipo END,
    u.localizacion = CASE WHEN t.localizacion IS NOT NULL AND TRIM(t.localizacion) <> '' THEN t.localizacion ELSE u.localizacion END,
    u.observacion_apto = CASE WHEN t.observacion_apto IS NOT NULL AND TRIM(t.observacion_apto) <> '' THEN LEFT(t.observacion_apto, 500) ELSE u.observacion_apto END,
    u.fecha_fec = CASE WHEN t.fecha_fec IS NOT NULL AND TRIM(t.fecha_fec) <> '' THEN STR_TO_DATE(t.fecha_fec, '%Y-%m-%d') ELSE u.fecha_fec END,
    u.fecha_edi = CASE WHEN t.fecha_edi IS NOT NULL AND TRIM(t.fecha_edi) <> '' THEN STR_TO_DATE(t.fecha_edi, '%Y-%m-%d') ELSE u.fecha_edi END,
    u.fecha_edi_mostrar = CASE WHEN t.fecha_edi_mostrar IS NOT NULL AND TRIM(t.fecha_edi_mostrar) <> '' THEN STR_TO_DATE(t.fecha_edi_mostrar, '%Y-%m-%d') ELSE u.fecha_edi_mostrar END,
    u.inv_terminado = CASE WHEN t.inv_terminado IS NOT NULL AND TRIM(t.inv_terminado) <> '' THEN CONVERT(t.inv_terminado, UNSIGNED) ELSE u.inv_terminado END,
    u.num_alcobas = CASE WHEN t.num_alcobas IS NOT NULL AND TRIM(t.num_alcobas) <> '' THEN CONVERT(t.num_alcobas, SIGNED) ELSE u.num_alcobas END,
    u.num_banos = CASE WHEN t.num_banos IS NOT NULL AND TRIM(t.num_banos) <> '' THEN CONVERT(t.num_banos, SIGNED) ELSE u.num_banos END,
    u.area_privada_cub = CASE WHEN t.area_privada_cub IS NOT NULL AND TRIM(t.area_privada_cub) <> '' THEN CONVERT(REPLACE(t.area_privada_cub, ',', '.'), DECIMAL(20,2)) ELSE u.area_privada_cub END,
    u.area_privada_lib = CASE WHEN t.area_privada_lib IS NOT NULL AND TRIM(t.area_privada_lib) <> '' THEN CONVERT(REPLACE(t.area_privada_lib, ',', '.'), DECIMAL(20,2)) ELSE u.area_privada_lib END,
    u.area_total = CASE WHEN t.area_total IS NOT NULL AND TRIM(t.area_total) <> '' THEN CONVERT(REPLACE(t.area_total, ',', '.'), DECIMAL(20,2)) ELSE u.area_total END,
    u.acue = CASE WHEN t.acue IS NOT NULL AND TRIM(t.acue) <> '' THEN CONVERT(REPLACE(t.acue, ',', '.'), DECIMAL(20,2)) ELSE u.acue END,
    u.area_total_mas_acue = CASE WHEN t.area_total_mas_acue IS NOT NULL AND TRIM(t.area_total_mas_acue) <> '' THEN CONVERT(REPLACE(t.area_total_mas_acue, ',', '.'), DECIMAL(20,2)) ELSE u.area_total_mas_acue END,
    u.valor_separacion = CASE WHEN t.valor_separacion IS NOT NULL AND TRIM(t.valor_separacion) <> '' THEN CONVERT(REPLACE(t.valor_separacion, ',', '.'), DECIMAL(20,2)) ELSE u.valor_separacion END,
    u.valor_acabados = CASE WHEN t.valor_acabados IS NOT NULL AND TRIM(t.valor_acabados) <> '' THEN CONVERT(REPLACE(t.valor_acabados, ',', '.'), DECIMAL(20,2)) ELSE u.valor_acabados END,
    u.valor_reformas = CASE WHEN t.valor_reformas IS NOT NULL AND TRIM(t.valor_reformas) <> '' THEN CONVERT(REPLACE(t.valor_reformas, ',', '.'), DECIMAL(20,2)) ELSE u.valor_reformas END,
    u.valor_descuento = CASE WHEN t.valor_descuento IS NOT NULL AND TRIM(t.valor_descuento) <> '' THEN CONVERT(REPLACE(t.valor_descuento, ',', '.'), DECIMAL(20,2)) ELSE u.valor_descuento END,
    u.valor_complemento = CASE WHEN t.valor_complemento IS NOT NULL AND TRIM(t.valor_complemento) <> '' THEN CONVERT(REPLACE(t.valor_complemento, ',', '.'), DECIMAL(20,2)) ELSE u.valor_complemento END,
    u.encargo_fiduciario = CASE WHEN t.encargo_fiduciario IS NOT NULL AND TRIM(t.encargo_fiduciario) <> '' THEN t.encargo_fiduciario ELSE u.encargo_fiduciario END,
    u.pate = CASE WHEN t.pate IS NOT NULL AND TRIM(t.pate) <> '' THEN t.pate ELSE u.pate END,
    u.id_cuenta_convenio = CASE WHEN t.id_cuenta_convenio IS NOT NULL AND TRIM(COALESCE(t.id_cuenta_convenio, '')) <> '' THEN t.id_cuenta_convenio ELSE u.id_cuenta_convenio END,
    u.asoleacion = CASE WHEN t.asoleacion IS NOT NULL AND TRIM(t.asoleacion) <> '' THEN t.asoleacion ELSE u.asoleacion END,
    u.altura = CASE WHEN t.altura IS NOT NULL AND TRIM(t.altura) <> '' THEN t.altura ELSE u.altura END,
    u.id_clase = CASE WHEN t.clase IS NOT NULL AND TRIM(t.clase) <> '' THEN (
        SELECT tp2.id_tipo_proyecto FROM dim_tipo_proyecto tp2 WHERE tp2.tipo_proyecto = t.clase
    ) ELSE u.id_clase END,
    u.id_lista = CASE WHEN t.lista IS NOT NULL AND TRIM(t.lista) <> '' THEN (
        SELECT l.id_lista FROM dim_lista_precios l WHERE l.lista = t.lista AND l.id_proyecto = @id_proyecto
    ) ELSE u.id_lista END,
    u.cerca_porteria = CASE WHEN t.cerca_porteria IS NOT NULL AND TRIM(t.cerca_porteria) <> '' THEN CONVERT(t.cerca_porteria, UNSIGNED) ELSE u.cerca_porteria END,
    u.cerca_juegos_infantiles = CASE WHEN t.cerca_juegos_infantiles IS NOT NULL AND TRIM(t.cerca_juegos_infantiles) <> '' THEN CONVERT(t.cerca_juegos_infantiles, UNSIGNED) ELSE u.cerca_juegos_infantiles END,
    u.cerca_piscina = CASE WHEN t.cerca_piscina IS NOT NULL AND TRIM(t.cerca_piscina) <> '' THEN CONVERT(t.cerca_piscina, UNSIGNED) ELSE u.cerca_piscina END,
    u.tiene_balcon = CASE WHEN t.tiene_balcon IS NOT NULL AND TRIM(t.tiene_balcon) <> '' THEN CONVERT(t.tiene_balcon, UNSIGNED) ELSE u.tiene_balcon END,
    u.tiene_parq_sencillo = CASE WHEN t.tiene_parq_sencillo IS NOT NULL AND TRIM(t.tiene_parq_sencillo) <> '' THEN CONVERT(t.tiene_parq_sencillo, UNSIGNED) ELSE u.tiene_parq_sencillo END,
    u.tiene_parq_doble = CASE WHEN t.tiene_parq_doble IS NOT NULL AND TRIM(t.tiene_parq_doble) <> '' THEN CONVERT(t.tiene_parq_doble, UNSIGNED) ELSE u.tiene_parq_doble END,
    u.tiene_deposito = CASE WHEN t.tiene_deposito IS NOT NULL AND TRIM(t.tiene_deposito) <> '' THEN CONVERT(t.tiene_deposito, UNSIGNED) ELSE u.tiene_deposito END,
    u.tiene_acabados = CASE WHEN t.tiene_acabados IS NOT NULL AND TRIM(t.tiene_acabados) <> '' THEN CONVERT(t.tiene_acabados, UNSIGNED) ELSE u.tiene_acabados END,
    u.id_agrupacion = CASE WHEN t.agrupacion IS NOT NULL AND TRIM(t.agrupacion) <> '' THEN (
        SELECT au.id_agrupacion FROM dim_agrupacion_unidad au WHERE au.nombre = t.agrupacion AND au.id_proyecto = @id_proyecto
    ) ELSE u.id_agrupacion END,
    u.updated_by = @Usuario,
    u.updated_on = CURRENT_TIMESTAMP
WHERE u.id_proyecto = @id_proyecto;


update tmp_unidades a
left join dim_tipo_proyecto tp on trim(a.clase) = tp.tipo_proyecto
join fact_unidades b on a.id_torre = b.id_torre and a.apartamento = b.numero_apartamento 
    and b.id_proyecto = @id_proyecto and tp.id_tipo_proyecto = b.id_clase
set a.id_unidad = b.id_unidad;


INSERT IGNORE INTO dim_agrupacion_unidad (id_proyecto, nombre, descripcion)
SELECT
@id_proyecto AS id_proyecto,
TRIM(t.agrupacion) AS nombre,
GROUP_CONCAT(CONCAT(COALESCE(tp.codigo, ''), ': ', t.apartamento)
    ORDER BY COALESCE(tp.codigo, ''), CAST(t.apartamento AS UNSIGNED) SEPARATOR ', ') AS descripcion
FROM tmp_unidades t
LEFT JOIN dim_tipo_proyecto tp
ON t.clase = tp.tipo_proyecto
WHERE t.agrupacion IS NOT NULL
AND TRIM(t.agrupacion) <> ''
GROUP BY TRIM(t.agrupacion);

update fact_unidades u
join tmp_unidades t on t.id_unidad = u.id_unidad
join dim_agrupacion_unidad au on au.id_proyecto = @id_proyecto and au.nombre = trim(t.agrupacion)
set u.id_agrupacion = au.id_agrupacion
where t.agrupacion is not null
    and trim(t.agrupacion) <> '' and (u.id_agrupacion is null or u.id_agrupacion <> au.id_agrupacion);

select 'OK' as respuesta;
