-- =============================================
-- Proceso: Unidades/Get_Unidades
-- =============================================
--START_PARAM
set @id_proyecto = 3;

--END_PARAM
select * 
from fact_torres
where id_proyecto = @id_proyecto;

select date_format(u.fecha_fec, '%Y-%m-%d %T') as fecha_fec, 
    date_format(u.fecha_edi, '%Y-%m-%d %T') as fecha_edi, 
    date_format(u.fecha_edi_mostrar, '%Y-%m-%d %T') as fecha_edi_mostrar, 
    (select pu.precio from dim_precio_unidad pu
        where pu.id_lista = if(u.id_lista is null, 
        (select p.id_lista from fact_proyectos p where p.id_proyecto = u.id_proyecto), u.id_lista) and pu.id_unidad = u.id_unidad
    ) as valor_unidad,
    (select l.lista from dim_lista_precios l where l.id_lista = if(u.id_lista is null, 
        (select p.id_lista from fact_proyectos p where p.id_proyecto = u.id_proyecto), u.id_lista)
    ) as lista,
    u.*, c.*, e.estado_unidad as estatus, u.numero_apartamento as apartamento
from fact_unidades u 
left join dim_estado_unidad e on u.id_estado_unidad = e.id_estado_unidad
left join dim_cuenta_convenio c on u.id_cuenta_convenio = c.id_cuenta_convenio
where u.id_proyecto = @id_proyecto
order by u.numero_apartamento;

select * from dim_estado_unidad;
