-- =============================================
-- Proceso: General/Ins_documento
-- =============================================
--START_PARAM
set @documento = NULL,
    @is_img = '0'

--END_PARAM

INSERT INTO dim_documento (documento, is_img) VALUES (@documento, if(@is_img = '0', 0, 1));
SELECT concat('OK-id_documento:', (SELECT id_documento from dim_documento where documento = @documento)) AS result;
