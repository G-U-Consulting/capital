-- =============================================
-- Proceso: Unidades/Upd_Tipos
-- =============================================
--START_PARAM
set @data = '[]';
--END_PARAM

drop temporary table if exists tmp_tipo_unidad;
create temporary table tmp_tipo_unidad as
select *
from json_table(
    @data,
    '$[*]'
    columns (
        id_tipo int path '$.id_tipo',
        id_archivo_planta varchar(50) path '$.id_archivo_planta',
        id_archivo_recorrido varchar(50) path '$.id_archivo_recorrido'
    )
) as t;

update dim_tipo_unidad d
join tmp_tipo_unidad t on d.id_tipo = t.id_tipo
set
    d.id_archivo_planta = if(t.id_archivo_planta = '' or t.id_archivo_planta is null, null, t.id_archivo_planta),
    d.id_archivo_recorrido = if(t.id_archivo_recorrido = '' or t.id_archivo_recorrido is null, null, t.id_archivo_recorrido);

drop temporary table if exists tmp_tipo_unidad;

select 'OK' as result;