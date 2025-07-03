-- =============================================
-- Proceso: General/Get_BancoFactor
-- =============================================
--START_PARAM
set @id_banco = @id_banco;

--END_PARAM


select bf.*, p.nombre as proyecto, f.factor as factor, tf.tipo_factor as tipo_factor, f.unidad as unidad
from dim_banco_factor bf join fact_proyectos p
on bf.id_proyecto = p.id_proyecto join dim_factor f
on bf.id_factor = f.id_factor join dim_tipo_factor tf
on bf.id_tipo_factor = tf.id_tipo_factor
where id_banco = @id_banco and bf.id_proyecto is not null;