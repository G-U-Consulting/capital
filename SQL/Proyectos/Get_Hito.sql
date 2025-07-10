-- =============================================
-- Proceso: Proyecto/Get_Hito
-- =============================================
--START_PARAM
set @id_sala = NULL;
--END_PARAM

select p.id_proyecto, p.nombre
from fact_proyectos p join dim_sala_proyecto sp
on p.id_proyecto = sp.id_proyecto
where sp.id_sala_venta = @id_sala and p.is_active = 1
order by p.nombre;

select id_hito, titulo, descripcion, date_format(fecha, '%Y-%m-%d %T') as fecha, 
    color, festivo, id_proyecto, frecuencia, date_format(limite, '%Y-%m-%d') as limite,
    (select p.nombre from fact_proyectos p where h.id_proyecto is not null and p.id_proyecto = h.id_proyecto) as nombre_pro
from dim_hito_sala h
where id_sala_venta = @id_sala
order by fecha;

select id_cargo, cargo, `Descripcion` as descripcion 
from dim_cargo
where is_active = 1
order by cargo;