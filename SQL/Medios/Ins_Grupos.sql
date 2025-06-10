-- =============================================
-- proceso: medios/ins_grupos
-- =============================================
--START_PARAM
set @grupo = '',
    @orden = 0,
    @id_proyecto = 1,
    @modulo = '',
    @is_active = false;
--END_PARAM

insert into dim_grupo_proyecto (
    grupo,
    orden,
    id_proyecto,
    modulo,
    is_active
) values (
    @grupo,
    @orden,
    @id_proyecto,
    @modulo,
    @is_active
);


select CONCAT(last_insert_id()) as result;

