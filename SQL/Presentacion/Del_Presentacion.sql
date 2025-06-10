-- =============================================
-- Proceso: Presentacion/Del_Presentacion
-- =============================================
--START_PARAM
--END_PARAM

delete a from fact_documento_proyecto a where a.tipo = 'Carrusel';

select 'OK' as result;