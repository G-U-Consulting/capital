-- =============================================
-- Proceso: ProcesoNegocio/Get_FactorMillon
-- =============================================
--START_PARAM
set @id_banco = '1',
    @unidadSeleccionada = 'COP',
    @anioSeleccionado = '10 años',
    @tipo_factor = 'NO VIS + SOSTENIBLE';
--END_PARAM

select id_factor into @id_factor
from dim_factor
where factor = @anioSeleccionado
    and unidad = @unidadSeleccionada
    limit 1;

select id_tipo_factor into @id_tipo_factor
from dim_tipo_factor
where lower(replace(tipo_factor, ' ', '')) = lower(replace(@tipo_factor, ' ', ''));

select valor, id_banco_factor
from dim_banco_factor
where
    id_banco = @id_banco
    and id_factor = @id_factor
    and id_tipo_factor = @id_tipo_factor;


