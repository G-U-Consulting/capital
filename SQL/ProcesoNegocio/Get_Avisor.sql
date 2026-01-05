-- =============================================
-- Proceso: ProcesoNegocio/Get_Avisor
-- =============================================
--START_PARAM
set @id_opcion = NULL;
--END_PARAM

select regexp_replace(coalesce(p.za1_id, (p.id_proyecto)), '[A-Za-z]', '') as `ID_rotafolio`, p.id_sede as `ID_ciudad`,
    us.id_usuario as `ID_asesor`, round(u.valor_separacion) as `TransValue`,
    u.id_estado_unidad, c.numero_documento as cedula, u.num_ref_bancaria as `textoReferenciaCupon`, 
    coalesce(u.encargo_fiduciario, u.pate) as `ReferenceArray3`, c.tipo_documento as `tipo_doc`,
    concat(coalesce(c.nombres, ''), ' ', coalesce(c.apellido1, ''), ' ', coalesce(c.apellido2, '')) as `nombreCompletoComprador`,
    coalesce(c.email1, c.email2) as `email`, cc.ean, cc.cuenta_tipo, cc.cuenta_numero, cc.convenio,
    case 
        when coalesce(t.id_fiduciaria, p.id_fiduciaria) = 6
            then coalesce(u.encargo_fiduciario, u.pate)
        when p.centro_costos is not null and p.centro_costos <> ''
            then concat(lpad(floor(rand() * 100), 2, '0'), lpad(p.centro_costos, 4, '0'), lpad(t.consecutivo, 2, '0'), lpad(u.numero_apartamento, 4, '0'))
        else concat(substring(unix_timestamp(), 1, 6), lpad(t.consecutivo, 2, '0'), lpad(u.numero_apartamento, 4, '0'))
    end as `Invoice`
from fact_opcion o
join fact_cotizaciones co on o.id_cotizacion = co.id_cotizacion
join fact_negocios_unidades n on n.id_cotizacion = co.id_cotizacion
join fact_clientes c on co.id_cliente = c.id_cliente
join fact_proyectos p on co.id_proyecto = p.id_proyecto
join fact_unidades u on n.id_unidad = u.id_unidad
join fact_torres t on u.id_torre = t.id_torre
join fact_usuarios us on o.created_by = us.usuario collate utf8mb4_general_ci
join dim_cuenta_convenio cc on u.id_cuenta_convenio = cc.id_cuenta_convenio
where o.id_opcion = @id_opcion;
