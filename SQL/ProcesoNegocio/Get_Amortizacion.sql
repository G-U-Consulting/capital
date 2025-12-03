-- =============================================
-- Proceso: ProcesoNegocio/Get_Amortizacion
-- =============================================
--START_PARAM
set @id_opcion = '1';
--END_PARAM

select
    id_amortizacion,
    id_opcion,
    periodo,
    DATE_FORMAT(fecha, '%Y-%m-%d') as fecha,
    saldo_inicial,
    tna,
    cuota_deseada,
    cuota_calculada,
    intereses,
    principal,
    saldo_final
from fact_amortizacion
where id_opcion = @id_opcion
order by periodo asc;
