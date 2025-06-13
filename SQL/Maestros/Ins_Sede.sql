-- =============================================
-- Proceso: General/Ins_Sede
-- =============================================
--START_PARAM
set @sede = NULL,
    @alias = NULL
--END_PARAM
start transaction;
set @id_sede = coalesce((select max(id_sede) from dim_sede), 0) + 1;
INSERT INTO dim_sede(id_sede, sede, alias) VALUES (@id_sede, @sede, @alias);
commit;
SELECT concat('OK-id_sede:', (SELECT id_sede from dim_sede where sede = @sede)) AS result;