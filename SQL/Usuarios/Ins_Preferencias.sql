-- =============================================
-- Proceso: /Usuarios/Get_Preferencias
-- =============================================
--START_PARAM
set @usuario = NULL,
    @nombre = NULL,
    @valor = NULL;
--END_PARAM

insert into dim_preferencias_usuario (id_usuario, nombre, valor)
values((select id_usuario from fact_usuarios where usuario = @usuario), @nombre, @valor);

select concat('OK-id_preferencia:', LAST_INSERT_ID()) as result;