-- =============================================
-- Proceso: Maestros/Ins_Color
-- =============================================
--START_PARAM
set @estado_unidad = NULL,
    @estado_unidad_plural = NULL,
    @color_fondo = NULL,
    @color_fuente = NULL,
    @is_virtual = NULL;

--END_PARAM

select max(id_estado_unidad) + 1 from dim_estado_unidad into @id;
INSERT INTO dim_estado_unidad (id_estado_unidad, estado_unidad, estado_unidad_plural, color_fondo, color_fuente, is_virtual)
values(@id, @estado_unidad, @estado_unidad_plural, @color_fondo, @color_fuente, if(@is_virtual = '1', 1, 0));
SELECT concat('OK-id_color:', @id) AS result;