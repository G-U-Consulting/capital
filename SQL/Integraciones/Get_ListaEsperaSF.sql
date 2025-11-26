-- =============================================
-- Proceso: Integraciones/Get_ListaEsperaSF
-- =============================================
--START_PARAM
set @id_lista = 1049;
--END_PARAM

select c.salesforce_id as `clientSalesforceId`, c.numero_documento as `docPotentialClient`, 
    p.za1_id as `idInterestedProyect`, u.za1_id as `idApartment`, 
    date_format(l.created_on, '%Y-%m-%d') as `dateInterested`, l.id_lista
from fact_lista_espera l
join fact_unidades u on l.id_unidad = u.id_unidad
join fact_proyectos p on l.id_proyecto = p.id_proyecto
join fact_clientes c on l.id_cliente = c.id_cliente
where l.id_lista = @id_lista;
