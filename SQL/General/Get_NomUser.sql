-- =============================================
-- Proceso: General/Get_NomUser
-- =============================================
--START_PARAM
set @user = '';
--END_PARAM

select nombres
from fact_usuarios
where usuario = @user;  
