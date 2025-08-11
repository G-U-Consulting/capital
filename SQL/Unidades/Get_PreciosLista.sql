-- =============================================
-- Proceso: Unidades/Get_ListasPrecios
-- =============================================
--START_PARAM
set @id_lista = NULL,
    @torres = '';
--END_PARAM

select pu.precio, pu.en_smlv, pu.precio_m2, pu.precio_alt, pu.en_smlv_alt, pu.precio_m2_alt, 
    t.consecutivo as torre, u.numero_apartamento as apartamento
from dim_precio_unidad pu
join fact_unidades u on pu.id_unidad = u.id_unidad
join fact_torres t on u.id_torre = t.id_torre
where pu.id_lista = @id_lista and find_in_set(t.consecutivo, @torres);
