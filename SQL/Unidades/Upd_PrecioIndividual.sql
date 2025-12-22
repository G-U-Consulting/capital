-- =============================================
-- Proceso: Unidades/Upd_PrecioIndividual
-- =============================================
--START_PARAM
set @id_precio = NULL,
    @precio = NULL,
    @en_smlv = NULL,
    @precio_m2 = NULL,
    @precio_alt = NULL,
    @en_smlv_alt = NULL,
    @precio_m2_alt = NULL;
--END_PARAM

update dim_precio_unidad
set precio = if(@precio is null or @precio = '', 0, @precio),
    en_smlv = if(@en_smlv is null or @en_smlv = '', 0, @en_smlv),
    precio_m2 = if(@precio_m2 is null or @precio_m2 = '', 0, @precio_m2),
    precio_alt = if(@precio_alt is null or @precio_alt = '', 0, @precio_alt),
    en_smlv_alt = if(@en_smlv_alt is null or @en_smlv_alt = '', 0, @en_smlv_alt),
    precio_m2_alt = if(@precio_m2_alt is null or @precio_m2_alt = '', 0, @precio_m2_alt)
where id_precio = @id_precio;

SELECT 'OK' AS result;