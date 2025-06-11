-- =============================================
-- Proceso: Maestros/Ins_Color
-- =============================================
--START_PARAM
set @estado = NULL,
    @color = NULL

--END_PARAM

INSERT INTO dim_color (estado, color) VALUES (@estado, @color);
SELECT concat('OK-id_color:', (SELECT id_color from dim_color where estado = @estado)) AS result;
