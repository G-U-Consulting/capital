-- =============================================
-- Proceso: Integraciones/Get_ListaEsperaSF
-- =============================================
--START_PARAM
set @id_lista = 1048;
--END_PARAM

select '001dm00000QQdOYAA1' as `clientSalesforceId`, c.numero_documento as `docPotentialClient`, 
    'a0Qdm000009uKgPEAU' as `idInterestedProyect`, 
    '01tdm000005PyAzAAK' as `idApartment`, date_format(l.created_on, '%Y-%m-%d') as `dateInterested`
from fact_lista_espera l
join fact_unidades u on l.id_unidad = u.id_unidad
join fact_proyectos p on l.id_proyecto = p.id_proyecto
join fact_clientes c on l.id_cliente = c.id_cliente
where l.id_lista = @id_lista;
