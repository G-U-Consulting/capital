-- =============================================
-- Proceso: Presentacion/Ins_Presentacion
-- =============================================
--START_PARAM
set @nombre_archivo, 
    @orden;
--END_PARAM

insert into dim_carrusel_imagenes (nombre_archivo, orden) values (@nombre_archivo, @orden);