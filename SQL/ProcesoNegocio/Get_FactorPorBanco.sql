-- =============================================
-- Proceso: ProcesoNegocio/Get_FactorPorBanco
-- =============================================
--START_PARAM
set @id_banco = 1;
--END_PARAM

select 
    dbf.id_banco,
    dbf.id_tipo_factor,
    t.tipo_factor,
    dbf.id_factor,
    f.factor,
    f.unidad,
    dbf.valor
from dim_banco_factor dbf
inner join dim_factor f 
    on f.id_factor = dbf.id_factor
inner join dim_tipo_factor t 
    on t.id_tipo_factor = dbf.id_tipo_factor
where dbf.id_proyecto is null
  and (@id_banco is null or dbf.id_banco = @id_banco)
order by t.tipo_factor, f.unidad, f.factor;
