-- =============================================
-- Proceso: Integraciones/Get_VisitaSF
-- =============================================
--START_PARAM
set @id_visita = 360;
--END_PARAM

select c.nombres as `firstName`, concat(coalesce(c.apellido1, ''), ' ', concat(coalesce(c.apellido2, ''))) as `lastName`, null as `company`,
    c.numero_documento as `_document`, 
    (CASE 
        WHEN c.tipo_documento = 'PAS' THEN 'Pasaporte'
        WHEN c.tipo_documento = 'CE' THEN 'Cédula de Extranjería'
        WHEN c.tipo_documento = 'NIT' THEN 'NIT'
        ELSE 'Cédula de Ciudadanía'
    END) as `typeDoc`, 
    s.sede as `cityLead`, c.pais_expedicion as `countryExpedition`,
    c.departamento_expedicion as `departmentExpedition`, c.ciudad_expedicion as `cityExpedition`, date_format(c.fecha_expedicion, '%Y-%m-%d') as `expeditionDate`,
    if(c.telefono1 is not null, c.codigo_tel1, c.codigo_tel2) as `indicative`, coalesce(c.email1, c.email2) as `email`, 
    cast(coalesce(c.telefono1, c.telefono2) as unsigned) as `_mobilePhone`, date_format(c.fecha_nacimiento, '%Y-%m-%d') as `birthDate`, c.ciudad as `cityResidence`, 
    c.departamento as `department`, c.direccion as `direction`, c.pais as `countryResidence`, c.is_politica_aceptada as `_AuthorizeData`,
    p.rango as `disposeToInvest`, t.tipo_registro as `registerType`, ma.modo_atencion_sf as `attentionReason`, c.id_cliente as `IdClient`, m.motivo_compra_sf as `reasonPurchase`,
    coalesce((select 1 from fact_visitas fv where fv.id_cliente = c.id_cliente and fv.id_tipo_registro = 1 limit 1), 0) as `_visitedSalesRoom`, 
    sv.sala_venta as `salesRoom`, date_format(v.created_on, '%Y-%m-%d') as `visitedDate`
from fact_visitas v
join fact_clientes c on v.id_cliente = c.id_cliente
left join dim_motivo_compra m on v.id_motivo_compra = m.id_motivo_compra
left join presupuesto_vivienda p on v.id_presupuesto_vivienda = p.id_presupuesto_vivienda
left join dim_tipo_registro t on v.id_tipo_registro = t.id_tipo_registro
left join dim_modo_atencion ma on v.id_modo_atencion = ma.id_modo_atencion
left join dim_sala_venta sv on v.id_sala_venta = sv.id_sala_venta
left join dim_sede s on sv.id_sede = s.id_sede
where id_visita = @id_visita;