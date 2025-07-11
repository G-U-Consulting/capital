-- =============================================
-- Proceso: General/Ins_TiposTramite
-- =============================================
--START_PARAM
set @tipo_tramite = NULL,

--END_PARAM

INSERT INTO dim_tipo_tramite (tipo_tramite) VALUES (@tipo_tramite);
SELECT concat('OK-id_tipo_tramite:', (SELECT id_tipo_tramite from dim_tipo_tramite where tipo_tramite = @tipo_tramite)) AS result;
