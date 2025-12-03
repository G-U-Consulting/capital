-- =============================================
-- Proceso: ProcesoNegocio/Ins_Amortizacion
-- =============================================
--START_PARAM
set @id_opcion = '1',
    @tabla_json = '[{"periodo":1,"fecha":"2025-01-15","saldo_inicial":100000000,"tna":12.5,"cuota_deseada":null,"cuota_calculada":5000000,"intereses":1041667,"principal":3958333,"saldo_final":96041667}]';
--END_PARAM

delete from fact_amortizacion where id_opcion = @id_opcion;

insert into fact_amortizacion (
    id_opcion,
    periodo,
    fecha,
    saldo_inicial,
    tna,
    cuota_deseada,
    cuota_calculada,
    intereses,
    principal,
    saldo_final
)
select
    @id_opcion,
    periodo,
    STR_TO_DATE(fecha, '%Y-%m-%d'),
    saldo_inicial,
    tna,
    case when cuota_deseada = '' or cuota_deseada is null then null else cuota_deseada end,
    cuota_calculada,
    intereses,
    principal,
    saldo_final
from JSON_TABLE(
    @tabla_json,
    '$[*]' COLUMNS(
        periodo int path '$.periodo',
        fecha varchar(20) path '$.fecha',
        saldo_inicial decimal(15,2) path '$.saldo_inicial',
        tna decimal(10,4) path '$.tna',
        cuota_deseada varchar(20) path '$.cuota_deseada',
        cuota_calculada decimal(15,2) path '$.cuota_calculada',
        intereses decimal(15,2) path '$.intereses',
        principal decimal(15,2) path '$.principal',
        saldo_final decimal(15,2) path '$.saldo_final'
    )
) as jt;

select 'ok' as result;
