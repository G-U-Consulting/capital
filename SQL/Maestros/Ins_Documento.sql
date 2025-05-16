-- =============================================
-- Proceso: General/Ins_documento
-- =============================================
--START_PARAM
set @documento = NULL

--END_PARAM

INSERT INTO dim_documento (documento) VALUES (@documento);
SELECT concat('OK-id_documento:', (SELECT id_documento from dim_documento where documento = @documento)) AS result;
