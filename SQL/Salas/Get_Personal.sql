-- =============================================
-- Proceso: Salas/Get_Personal
-- =============================================
--START_PARAM
set @id_sala_venta = NULL;
--END_PARAM

select u.id_usuario, u.usuario, u.nombres, date_format(u.created_on, '%Y-%m-%d %T') as created_on,
    (select count(*) from fact_roles_usuarios ru where u.id_usuario = ru.id_usuario) as cuenta,
    c.cargo, u.identificacion, if(u.is_active, 1, 0) as is_active, ps.permanente
from fact_usuarios u 
left join dim_cargo c on u.id_cargo = c.id_cargo
join dim_personal_sala ps on u.id_usuario = ps.id_usuario
where ps.id_sala_venta = @id_sala_venta;