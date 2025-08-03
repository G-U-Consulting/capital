-- =============================================
-- Proceso: Unidades/Get_Unidades
-- =============================================
--START_PARAM
set @id_proyecto = NULL;

--END_PARAM
select * 
from fact_torres
where id_proyecto = @id_proyecto;

select date_format(u.fecha_fec, '%Y-%m-%d %T') as fecha_fec, 
    date_format(u.fecha_edi, '%Y-%m-%d %T') as fecha_edi, 
    date_format(u.fecha_edi_mostrar, '%Y-%m-%d %T') as fecha_edi_mostrar, 
    u.*, c.*, e.estado_unidad as estatus, u.numero_apartamento as apartamento
from fact_unidades u 
left join dim_estado_unidad e on u.id_estado_unidad = e.id_estado_unidad
left join dim_cuenta_convenio c on u.id_cuenta_convenio = c.id_cuenta_convenio
where u.id_proyecto = @id_proyecto
order by u.numero_apartamento;

select * from dim_estado_unidad;
