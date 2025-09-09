-- =============================================
-- Proceso: General/Ins_Tipo_proyecto
-- =============================================
--START_PARAM
set @tipo_proyecto = NULL,
    @codigo = NULL;

--END_PARAM
INSERT INTO dim_tipo_proyecto (tipo_proyecto, codigo) VALUES (@tipo_proyecto, @codigo);
SELECT concat('OK-id_tipo_proyecto:', (SELECT id_tipo_proyecto from dim_tipo_proyecto where tipo_proyecto = @tipo_proyecto)) AS result;
