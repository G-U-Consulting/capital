-- =============================================
-- Proceso: Proyecto/Get_Bancos 
-- =============================================
--START_PARAM
set @id_proyecto = NULL;
--END_PARAM

select db.id_banco, db.banco, db.is_active
from dim_banco_constructor db join fact_banco_financiador fb 
on db.id_banco = fb.id_banco_financiador
where fb.id_proyecto = @id_proyecto
order by db.banco;

select id_factor, factor, unidad from dim_factor order by id_factor;

select id_tipo_factor, tipo_factor from dim_tipo_factor;

select coalesce(c.id_banco, g.id_banco) as id_banco, 
    coalesce(c.id_factor, g.id_factor) as id_factor, 
    coalesce(c.id_tipo_factor, g.id_tipo_factor) as id_tipo_factor, 
    coalesce(c.valor, g.valor) as valor,
    c.id_proyecto
from dim_banco_factor g left join dim_banco_factor c
on g.id_banco = c.id_banco and g.id_factor = c.id_factor and g.id_tipo_factor = c.id_tipo_factor and c.id_proyecto = @id_proyecto
where g.id_proyecto is null and g.id_banco in 
(select bf.id_banco_financiador from fact_banco_financiador bf where id_proyecto = @id_proyecto);

select * from fact_unidades where id_unidad = 131319;