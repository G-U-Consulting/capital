-- =============================================
-- Proceso: Salas/Get_InitHito
-- =============================================
--START_PARAM
set @id_sala_venta = NULL;
--END_PARAM

select p.id_proyecto, p.nombre
from fact_proyectos p join dim_sala_proyecto sp
on p.id_proyecto = sp.id_proyecto
where sp.id_sala_venta = @id_sala_venta and p.is_active = 1
order by p.nombre;

select t.id_torre, concat('Torre ', t.consecutivo) as torre, t.id_proyecto
from fact_torres t 
join fact_proyectos p on t.id_proyecto = p.id_proyecto
join dim_sala_proyecto sp on p.id_proyecto = sp.id_proyecto
where sp.id_sala_venta = @id_sala_venta and p.is_active = 1
order by p.id_proyecto, t.consecutivo;

select un.id_unidad, concat(un.clase, ' ', un.numero_apartamento) as unidad, 
    un.id_torre, un.id_proyecto
from fact_unidades un
join fact_torres t on un.id_torre = t.id_torre
join fact_proyectos p on t.id_proyecto = p.id_proyecto
join dim_sala_proyecto sp on p.id_proyecto = sp.id_proyecto
where sp.id_sala_venta = @id_sala_venta and p.is_active = 1
order by p.id_proyecto, t.consecutivo, un.clase, un.numero_apartamento;

select id_cargo, cargo, `Descripcion` as descripcion 
from dim_cargo
where is_active = 1
order by cargo;