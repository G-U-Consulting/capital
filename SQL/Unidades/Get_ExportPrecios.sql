-- =============================================
-- Proceso: Unidades/Get_ExportPrecios
-- =============================================
--START_PARAM
set @id_proyecto = 5;

--END_PARAM

select pu.id_precio as `ID_precio`, u.numero_apartamento as apartamento, t.consecutivo as torre, l.lista, 
    cast(pu.precio as char) as precio, cast(pu.en_smlv as char) as en_smlv, 
    cast(pu.precio_m2 as char) as precio_m2, cast(pu.precio_alt as char) as precio_alt, 
    cast(pu.en_smlv_alt as char) as en_smlv_alt, cast(pu.precio_m2_alt as char) as precio_m2_alt
from dim_lista_precios l
join dim_precio_unidad pu on l.id_lista = pu.id_lista
join fact_unidades u on pu.id_unidad = u.id_unidad
join fact_torres t on u.id_torre = t.id_torre
where l.id_proyecto = @id_proyecto;
