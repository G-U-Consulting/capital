-- =============================================
-- Proceso: ProcesoNegocio/Get_variables
-- =============================================
--START_PARAM
--END_PARAM

select id_categoria, categoria
from dim_categoria_medio
where is_active = 1;

select id_medio, medio
from dim_medio_publicitario
where is_active = 1;

select id_motivo_compra, motivo_compra
from dim_motivo_compra
where is_active = 1;

select id_referencia, referencia
from dim_referencias
where is_active = 1;

select id_tipo_registro, tipo_registro
from dim_tipo_registro
where is_active = 1;

select id_modo_atencion, modo_atencion
from dim_modo_atencion
where is_active = 1;

select id_presupuesto_vivienda, rango
from presupuesto_vivienda;
