-- =============================================
-- Proceso: /Usuarios/Get_Preferencias
-- =============================================
--START_PARAM
set @usuario = NULL,
    @nombre = NULL,
    @valor = NULL;
--END_PARAM

update dim_preferencias_usuario set valor = @valor
where id_usuario = (select id_usuario from fact_usuarios where usuario = @usuario)
and nombre = @nombre;

select 'OK' as result;