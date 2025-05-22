-- =============================================
-- Proceso: Medios/Del_Archivos
-- =============================================
--START_PARAM
set @id_proyecto,
    @tipo;
--END_PARAM

update fact_documento_proyecto
set is_active = 0
where id_proyecto = @id_proyecto
  and tipo like CONCAT('%', @tipo, '%');

select 'OK' as result;