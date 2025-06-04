-- =============================================
-- Proceso: General/Upd_PieLegal
-- =============================================
--START_PARAM
set
    @id_pie_legal = '',
    @pie_legal = '',
    @texto = '',
    @notas_extra = '',
    @is_active = '0'
--END_PARAM

UPDATE dim_pie_legal
    SET pie_legal = @pie_legal, 
        texto = @texto, 
        notas_extra = @notas_extra,
        is_active = if(@is_active = '0', 0, 1)
    WHERE id_pie_legal = @id_pie_legal;

select 'OK' as result;