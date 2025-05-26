-- =============================================
-- proceso: medios/ins_grupos
-- =============================================
--START_PARAM
set @grupo = '',
    @orden = 0,
    @id_proyecto = 0,
    @modulo = '';
--END_PARAM

insert into dim_grupo_proyecto (
    grupo,
    orden,
    id_proyecto,
    modulo
) values (
    @grupo,
    @orden,
    @id_proyecto,
    @modulo
);

-- resultado
select CONCAT(last_insert_id()) as result;

