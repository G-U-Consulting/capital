-- =============================================
-- Proceso: ProcesoNegocio/Get_Registro
-- =============================================
--START_PARAM
set @cliente = '',
    @id_visita = '';
--END_PARAM

select a.id_visita,
       a.id_cliente,
       a.id_categoria_medio,
       a.id_medio,
       a.id_motivo_compra,
       a.id_referencia,
       a.presupuesto_disponible,
       a.otro_texto,
       e.motivo_compra as motivo,
       f.referencia as referencia,
       a.created_on as fecha,
       g.nombre as proyecto,
       a.descripcion,
       (
        select group_concat(id_tipo_registro)
        from fact_tipo_registro
        where id_visita = a.id_visita
      ) as tipo_registro,
      (
        select group_concat(id_modo_atencion)
        from fact_modo_atencion
        where id_visita = a.id_visita
      ) as modo_atencion,
      (
        select group_concat(c.tipo_registro)
        from fact_tipo_registro b
        join dim_tipo_registro c on b.id_tipo_registro = c.id_tipo_registro
        where b.id_visita = a.id_visita
      ) as nombre_tipo_registro,
      (
        select group_concat(d.modo_atencion)
        from fact_modo_atencion b
        join dim_modo_atencion d on b.id_modo_atencion = d.id_modo_atencion
        where b.id_visita = a.id_visita
      ) as nombre_modo_atencion
from fact_visitas a
join fact_clientes b on a.id_cliente = b.id_cliente
join dim_motivo_compra e on a.id_motivo_compra = e.id_motivo_compra
join dim_referencias f on a.id_referencia = f.id_referencia
join fact_proyectos g on a.id_proyecto = g.id_proyecto
where a.is_active = 1 and (
  b.numero_documento = @cliente
  or a.id_visita = @id_visita
)
order by a.created_on desc

