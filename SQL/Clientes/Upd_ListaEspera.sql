-- =============================================
-- Proceso: Clientes/Upd_ListaEspera
-- =============================================
--START_PARAM
set @id_lista = NULL,
	@id_cliente = NULL,
	@id_proyecto = NULL,
	@id_unidad = NULL,
	@id_torre = NULL,
	@piso = NULL,
	@id_tipo = NULL,
	@id_clase = NULL,
	@localizacion = NULL,
	@num_alcobas = NULL,
	@num_banos = NULL,
	@asoleacion = NULL,
	@altura = NULL,
	@cerca_porteria = NULL,
	@cerca_juegos_infantiles = NULL,
	@cerca_piscina = NULL,
	@tiene_balcon = NULL,
	@tiene_parq_sencillo = NULL,
	@tiene_parq_doble = NULL,
	@tiene_deposito = NULL,
	@tiene_acabados = NULL,
	@is_waiting = NULL,
	@is_active = NULL;
--END_PARAM

update fact_lista_espera
set id_cliente = @id_cliente,
	id_proyecto = @id_proyecto,
	id_unidad = if(@id_unidad = '', null, @id_unidad),
	id_torre = if(@id_torre = '', null, @id_torre),
	piso = if(@piso = '', null, @piso),
	id_tipo = if(@id_tipo = '', null, @id_tipo),
	id_clase = if(@id_clase = '', null, @id_clase),
	localizacion = if(@localizacion = '', null, @localizacion),
	num_alcobas = if(@num_alcobas = '', null, @num_alcobas),
	num_banos = if(@num_banos = '', null, @num_banos),
	asoleacion = if(@asoleacion = '', null, @asoleacion),
	altura = if(@altura = '', null, @altura),
	cerca_porteria = if(@cerca_porteria = '1', 1, 0),
	cerca_juegos_infantiles = if(@cerca_juegos_infantiles = '1', 1, 0),
	cerca_piscina = if(@cerca_piscina = '1', 1, 0),
	tiene_balcon = if(@tiene_balcon = '1', 1, 0),
	tiene_parq_sencillo = if(@tiene_parq_sencillo = '1', 1, 0),
	tiene_parq_doble = if(@tiene_parq_doble = '1', 1, 0),
	tiene_deposito = if(@tiene_deposito = '1', 1, 0),
	tiene_acabados = if(@tiene_acabados = '1', 1, 0),
	is_waiting = if(@is_waiting = '1', 1, 0),
	is_active = if(@is_active = '1', 1, 0)
where id_lista = @id_lista;

select 'OK' as result;