-- =============================================
-- Proceso: General/Upd_TipoVIS
-- =============================================
--START_PARAM
set
    @emails = NULL
--END_PARAM

call fn_emails(@emails);
select 'OK' as result;