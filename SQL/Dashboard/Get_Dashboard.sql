-- =============================================
-- Proceso: Dashboard/Get_Dashboard
-- =============================================
--START_PARAM
set @view = null;
--END_PARAM

if @view not in (select name from dim_whitelist_views) or @view is null then
  signal sqlstate '45000' set message_text = 'Vista no permitida';
end if;

set @sql = concat('select * from vw_', @view, ';');
prepare stmt from @sql;
execute stmt;
deallocate prepare stmt;