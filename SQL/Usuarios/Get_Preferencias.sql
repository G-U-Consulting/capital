-- =============================================
-- Proceso: /Usuarios/Get_Preferencias
-- =============================================
--START_PARAM
set @usuario = 'vistaProyecto',
    @nombre = 'a.Prueba_9';
--END_PARAM

select id_preferencia, fu.usuario, dpu.nombre, dpu.valor from dim_preferencias_usuario dpu
join fact_usuarios fu on fu.id_usuario = dpu.id_usuario
where (@usuario is null || fu.usuario = @usuario) and (@nombre is null || find_in_set(nombre, @nombre collate utf8mb4_unicode_ci))
order by fu.usuario, dpu.nombre;

select * from fact_usuarios;
select * from dim_preferencias_usuario;