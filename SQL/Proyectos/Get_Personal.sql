-- =============================================
-- Proceso: Proyectos/Get_Personal
-- =============================================
--START_PARAM
set @id_sala = NULL;
--END_PARAM

select id_sala_venta, sala_venta, encuesta_vpn, id_sede, id_playlist
from dim_sala_venta 
where id_sala_venta = @id_sala and is_active = 1;

select u.id_usuario, u.usuario, u.nombres, date_format(u.created_on, '%Y-%m-%d %T') as created_on,
    (select count(*) from fact_roles_usuarios ru where u.id_usuario = ru.id_usuario) as cuenta,
    c.cargo, u.identificacion, u.is_active is_active
from fact_usuarios u 
left join dim_cargo c on u.id_cargo = c.id_cargo
join dim_personal_sala ps on u.id_usuario = ps.id_usuario
where ps.id_sala_venta = @id_sala;