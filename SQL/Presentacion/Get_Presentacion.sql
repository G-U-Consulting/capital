-- =============================================
-- Proceso: Presentacion/Get_Presentacion
-- =============================================
--START_PARAM
--END_PARAM


select a.valor
from dim_variables_globales a
where a.nombre_variable = 'CarDurac';

select a.id_documento, a.tipo, a.orden, b.documento, b.llave
from fact_documento_proyecto a 
left join fact_documentos b on a.id_documento = b.id_documento
where a.tipo = 'Carrusel'
order by orden asc