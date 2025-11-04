-- =============================================
-- proceso: procesonegocio/get_plazos
-- =============================================

select 
    descripcion,
    dias_banco_constructor_escrituracion,
    dias_banco_aliado_escrituracion,
    dias_fna_otros_escrituracion,
    dias_banco_constructor_entrega,
    dias_banco_aliado_entrega,
    dias_fna_otros_entrega
from fact_plazos
where is_active = 1;