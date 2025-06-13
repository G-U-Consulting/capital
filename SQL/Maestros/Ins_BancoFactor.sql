-- =============================================
-- Proceso: General/Ins_banco_factor
-- =============================================
--START_PARAM
set @id_banco = NULL,
    @id_factor = NULL,
    @id_tipo_factor = NULL,
    @valor = '0',
    @id_proyecto = NULL

--END_PARAM

INSERT INTO dim_banco_factor (id_banco, id_factor, valor, id_proyecto, id_tipo_factor) 
    VALUES (@id_banco, @id_factor, @valor, @id_proyecto, @id_tipo_factor);
SELECT concat('OK-id_banco_factor:', 
    (SELECT id_banco_factor from dim_banco_factor where id_banco = @id_banco AND id_factor = @id_factor and id_proyecto = @id_proyecto and id_tipo_factor = @id_tipo_factor)) 
AS result;
