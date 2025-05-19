-- =============================================
-- Proceso: General/Ins_EstadoProyecto
-- =============================================
--START_PARAM
set @estado_publicacion = NULL

--END_PARAM

INSERT INTO dim_estado_pubicacion (estado_publicacion) VALUES (@estado_publicacion);
SELECT concat('OK-id_estado_publicacion:', (SELECT id_estado_publicacion from dim_estado_pubicacion where estado_publicacion = @estado_publicacion)) AS result;
