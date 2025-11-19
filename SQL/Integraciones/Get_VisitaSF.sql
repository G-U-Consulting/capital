-- =============================================
-- Proceso: Integraciones/Get_VisitaSF
-- =============================================
--START_PARAM
set @id_visita = 256;
--END_PARAM

select c.nombres as `firstName`, concat(coalesce(c.apellido1, ''), concat(coalesce(c.apellido2, ''))) as `lastName`, null as `company`,
    c.numero_documento as `document`, c.tipo_documento as `typeDoc`, 'Bogotá' as `cityLead`, c.pais_expedicion as `countryExpedition`,
    c.departamento_expedicion as `departmentExpedition`, c.ciudad_expedicion as `cityExpedition`, date_format(c.fecha_expedicion, '%Y-%m-%d') as `expeditionDate`,
    '+57' as `indicative`, coalesce(c.email1, c.email2) as `email`, coalesce(c.telefono1, c.telefono2) as `mobilePhone`, date_format(c.fecha_nacimiento, '%Y-%m-%d') as `birthDate`,
    c.ciudad as `cityResidence`, c.departamento as `department`, c.direccion as `direction`, c.pais as `countryResidence`, 
    c.is_politica_aceptada as `_AuthorizeData`, v.id_visita,
    p.rango as `disposeToInvest`, 'Presencial' as `registerType`, 'Trámites' as `attentionReason`, c.id_cliente as `IdClient`, m.motivo_compra as `reasonPurchase`,
    true as `_visitedSalesRoom`, 'Sala prueba BOG' as `salesRoom`, date_format(v.created_on, '%Y-%m-%d') as `visitedDate`
from fact_visitas v
join fact_clientes c on v.id_cliente = c.id_cliente
left join dim_motivo_compra m on v.id_motivo_compra = m.id_motivo_compra
left join presupuesto_vivienda p on v.id_presupuesto_vivienda = p.id_presupuesto_vivienda
-- left join dim_tipo_registro t on v.? = t.id_tipo_registro
-- left join dim_modo_atencion ma on v.? = ma.modo_atencion
-- left join dim_sala_venta sv on v.? = sv.id_sala_venta
where id_visita = @id_visita;