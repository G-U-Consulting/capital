-- =============================================
-- Proceso: General/Ins_medio
-- =============================================
--START_PARAM
set 
    @medio = '',
    @is_active = 0,
    @id_categoria = '',
    @id_sinco
--END_PARAM

INSERT INTO dim_medio_publicitario (medio, is_active, id_categoria, id_sinco) VALUES (@medio, @is_active, @id_categoria, @id_sinco);
SELECT concat('OK-id_medio:', (SELECT id_medio from dim_medio_publicitario where medio = @medio)) AS result;
