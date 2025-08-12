-- =============================================
-- Proceso: Unidades/Ins_ListaPrecios
-- =============================================
--START_PARAM
set @id_proyecto = NULL,
    @listas = '{}',
    @Usuario = NULL;
--END_PARAM

drop table if exists tmp_lista_precios;
create temporary table tmp_lista_precios as(
    select *
    from json_table(@listas, '$.*.torres.*.precios[*]' columns( 
        id_precio varchar(50) path '$."ID_precio"',
        lista varchar(50) path '$."lista"',
        torre varchar(50) path '$."torre"',
        apartamento varchar(50) path '$."apartamento"',
        precio varchar(50) path '$."precio"',
        en_smlv varchar(50) path '$."en_smlv"',
        precio_m2 varchar(50) path '$."precio_m2"',
        precio_alt varchar(50) path '$."precio_alt"',
        en_smlv_alt varchar(50) path '$."en_smlv_alt"',
        precio_m2_alt varchar(50) path '$."precio_m2_alt"',
        selected varchar(50) path '$."selected"'
    )) as a 
    where a.selected = 'true' or a.selected = true
);

insert into dim_lista_precios(lista, id_proyecto, updated_by)
select t.lista, @id_proyecto, @Usuario 
from tmp_lista_precios t 
left join dim_lista_precios l on t.lista = l.lista and l.id_proyecto = @id_proyecto
where l.id_lista is null
group by t.lista
on duplicate key update
    updated_on = current_timestamp, 
    updated_by = @Usuario;

update dim_lista_precios l
set l.updated_on = current_timestamp, l.updated_by = @Usuario
where l.lista in (select t.lista from tmp_lista_precios t group by t.lista) and l.id_proyecto = @id_proyecto;

insert into dim_precio_unidad(id_lista, id_unidad, id_precio, precio, en_smlv, precio_m2, precio_alt, en_smlv_alt, precio_m2_alt, updated_by, updated_on) 
select distinct
    (select l.id_lista from dim_lista_precios l where l.lista = t.lista and l.id_proyecto = @id_proyecto) as id_lista,
    (select u.id_unidad from fact_unidades u join fact_torres ft on u.id_torre = ft.id_torre 
        where u.id_proyecto = @id_proyecto and ft.consecutivo = t.torre and u.numero_apartamento = t.apartamento) as id_unidad,
    id_precio as id_precio,
    convert(t.precio, decimal(20, 2)) as precio,
    convert(t.en_smlv, decimal(20, 2)) as en_smlv,
    convert(t.precio_m2, decimal(20, 2)) as precio_m2,
    convert(t.precio_alt, decimal(20, 2)) as precio_alt,
    convert(t.en_smlv_alt, decimal(20, 2)) as en_smlv_alt,
    convert(t.precio_m2_alt, decimal(20, 2)) as precio_m2_alt,
    @Usuario as updated_by,
    current_timestamp as updated_on
from tmp_lista_precios t
on duplicate key update
    precio = values(precio),
    en_smlv = values(en_smlv),
    precio_m2 = values(precio_m2),
    precio_alt = values(precio_alt),
    en_smlv_alt = values(en_smlv_alt),
    precio_m2_alt = values(precio_m2_alt),
    updated_by = @Usuario,
    updated_on = current_timestamp;

select 'OK' as respuesta;