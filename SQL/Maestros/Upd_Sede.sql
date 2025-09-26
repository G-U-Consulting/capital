-- =============================================
-- Proceso: General/Upd_Sede
-- =============================================
--START_PARAM
set
    @id_sede = NULL,
    @sede = NULL,
    @alias = NULL,
    @is_active = '0',
    @id_gerente = NULL;
--END_PARAM

UPDATE dim_sede
    SET sede = @sede,
        alias = @alias,
        is_active = if(@is_active = '0', 0, 1),
        id_gerente = if(@id_gerente = '', NULL, @id_gerente)
    WHERE id_sede = @id_sede;

select 'OK' as result;