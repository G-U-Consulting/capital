-- =============================================
-- Proceso: Medios/Get_SaveCliente
-- =============================================
--START_PARAM
set @username = 'alejandros';
--END_PARAM


select *
from fact_cliente_actual
where
   username COLLATE utf8mb4_unicode_ci = @username
    and is_active = 1;