-- =============================================
-- Proceso: General/Ins_TipoVIS
-- =============================================
--START_PARAM
set @tipo_vis = ''

--END_PARAM

INSERT INTO dim_tipo_vis (tipo_vis) VALUES (@tipo_vis);
SELECT concat('OK-id_tipo_vis:', (SELECT id_tipo_vis from dim_tipo_vis where tipo_vis = @tipo_vis)) AS result;
