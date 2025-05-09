-- =============================================
-- Proceso: General/Ins_categoria
-- =============================================
--START_PARAM
set @categoria = ''

--END_PARAM

INSERT INTO dim_categoria_medio (categoria) VALUES (@categoria);
SELECT concat('OK-id_categoria:', (SELECT id_categoria from dim_categoria_medio where categoria = @categoria)) AS result;
