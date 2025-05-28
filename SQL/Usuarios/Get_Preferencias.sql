-- =============================================
-- Proceso: /Usuarios/Get_Preferencias
-- =============================================
--START_PARAM
set @usuario = NULL,
    @nombre = NULL;
--END_PARAM

select id_preferencia, fu.usuario, dpu.nombre, dpu.valor from dim_preferencias_usuario dpu
join fact_usuarios fu on fu.id_usuario = dpu.id_usuario
where (@usuario is null || fu.usuario = @usuario) and (@nombre is null || find_in_set(nombre, @nombre))
order by fu.usuario, dpu.nombre;