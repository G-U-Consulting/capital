-- =============================================
-- Proceso: General/Get_informes
-- =============================================
--START_PARAM

--END_PARAM

select id_procedimiento_informe, nombre, tipo
from dim_procedimientos_informes
where tipo = "Informes";  

select id_procedimiento_informe, nombre, tipo
from dim_procedimientos_informes
where tipo = "Archivos";  