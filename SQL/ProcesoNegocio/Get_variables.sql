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

select id_tipo_tramite, tipo_tramite
from dim_tipo_tramite
where is_active = 1;

select id_planes_pago, descripcion
from dim_planes_pago
where is_active = 1;

select id_tipo_financiacion, tipo_financiacion
from dim_tipo_financiacion
where is_active = 1;
