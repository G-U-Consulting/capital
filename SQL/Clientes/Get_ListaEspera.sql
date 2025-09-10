-- =============================================
-- Proceso: Clientes/Get_ListaEspera
-- =============================================
--START_PARAM
set @id_proyecto = 1,
    @id_usuario = NULL;
--END_PARAM

select id_torre, id_proyecto, consecutivo, orden_salida, en_venta, aptos_piso, aptos_fila, id_sinco, 
    date_format(fecha_p_equ,'%Y-%m-%d') as fecha_p_equ, date_format(fecha_inicio_obra,'%Y-%m-%d') as fecha_inicio_obra, 
    date_format(fecha_escrituracion,'%Y-%m-%d') as fecha_escrituracion, tasa_base, antes_p_equ, despues_p_equ, 
    id_fiduciaria, cod_proyecto_fid, nit_fid_doc_cliente, id_instructivo, propuesta_pago, consecutivo as idtorre
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
    tp.tipo_proyecto as clase,
    u.*, c.*, e.estado_unidad as estatus, u.numero_apartamento as apartamento
from fact_unidades u 
left join dim_estado_unidad e on u.id_estado_unidad = e.id_estado_unidad
left join dim_cuenta_convenio c on u.id_cuenta_convenio = c.id_cuenta_convenio
left join dim_tipo_proyecto tp on u.id_clase = tp.id_tipo_proyecto
where u.id_proyecto = @id_proyecto
order by u.numero_apartamento;

select tp.id_tipo_proyecto as id_clase, tp.tipo_proyecto as clase
from fact_unidades u 
join dim_tipo_proyecto tp on u.id_clase = tp.id_tipo_proyecto
where u.id_proyecto = @id_proyecto
group by tp.id_tipo_proyecto;

select id_tipo, tipo, id_proyecto, id_archivo_planta, id_archivo_recorrido
from dim_tipo_unidad
where id_proyecto = @id_proyecto and tipo != '';

select id_usuario, usuario, nombres
from fact_usuarios
where id_usuario = @id_usuario;