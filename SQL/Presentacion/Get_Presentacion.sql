-- =============================================
-- Proceso: Presentacion/Get_Presentacion
-- =============================================
--START_PARAM
--END_PARAM


select a.valor
from dim_variables_globales a
where a.nombre_variable = 'CarDurac';

select nombre_archivo a
from dim_carrusel_imagenes a 
order by orden asc