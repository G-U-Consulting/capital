-- =============================================
-- Proceso: General/Ins_TiposRegistro
-- =============================================
--START_PARAM
set @tipo_registro = NULL,

--END_PARAM

INSERT INTO dim_tipo_registro (tipo_registro) VALUES (@tipo_registro);
SELECT concat('OK-id_tipo_registro:', (SELECT id_tipo_registro from dim_tipo_registro where tipo_registro = @tipo_registro)) AS result;
