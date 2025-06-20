-- =============================================
-- Proceso: /Usuarios/Upd_Preferencias
-- =============================================
--START_PARAM
set @usuario = NULL,
    @nombre = NULL,
    @valor = NULL,
    @result = '';
--END_PARAM

call fn_preferences(@usuario, @nombre, @valor, 'update', @result);

select @result as result;