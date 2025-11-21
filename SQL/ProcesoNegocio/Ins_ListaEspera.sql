-- =============================================
-- Proceso: ProcesoNegocio/Ins_ListaEspera
-- =============================================
--START_PARAM
set 
	@id_cliente,
	@usuario,
	@id_proyecto,
	@id_unidad,
	@id_torre,
	@piso,
	@id_tipo,
	-- @id_clase,
	@localizacion,
	@num_alcobas,
	@num_banos,
	@asoleacion,
	@altura,
	@cerca_porteria,
	@cerca_juegos_infantiles,
	@cerca_piscina,
	@tiene_balcon,
	@tiene_parq_sencillo,
	@tiene_parq_doble,
	@tiene_deposito,
	@tiene_acabados;
--END_PARAM

set @id_usuario = (
    select id_usuario
    from fact_usuarios
    where TRIM(LOWER(usuario)) = TRIM(LOWER(@usuario))
    LIMIT 1
);

insert into fact_lista_espera (
	id_cliente,
	id_usuario,
	id_proyecto,
	id_unidad,
	id_torre,
	piso,
	id_tipo,
	-- id_clase,
	localizacion,
	num_alcobas,
	num_banos,
	asoleacion,
	altura,
	cerca_porteria,
	cerca_juegos_infantiles,
	cerca_piscina,
	tiene_balcon,
	tiene_parq_sencillo,
	tiene_parq_doble,
	tiene_deposito,
	tiene_acabados
)
select
	@id_cliente,
	@id_usuario,
	@id_proyecto,
	@id_unidad,
	@id_torre,
	@piso,
	@id_tipo,
	-- @id_clase,
	@localizacion,
	@num_alcobas,
	@num_banos,
	@asoleacion,
	@altura,
	@cerca_porteria,
	@cerca_juegos_infantiles,
	@cerca_piscina,
	@tiene_balcon,
	@tiene_parq_sencillo,
	@tiene_parq_doble,
	@tiene_deposito,
	@tiene_acabados;

set @id_lista = last_insert_id();
insert into cola_tareas_rpa(tipo, llave) 
values('fact_lista_espera', @id_lista);

select concat('OK-id_lista:', @id_lista) as result;