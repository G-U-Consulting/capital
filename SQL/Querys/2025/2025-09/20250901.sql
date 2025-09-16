create table dim_veto_cliente(
    id_veto int primary key auto_increment,
    fecha datetime default current_timestamp,
    id_cliente int not null unique references fact_clientes(id_cliente),
    motivo text,
    solicitado_por varchar(50) not null,
    vetado_por varchar(50),
    vigente bit default 0,
    id_tarea int references dim_tarea_usuario(id_tarea)
);
create trigger tr_update_veto_cliente after update on dim_veto_cliente for each row
begin
    if new.vigente = 1 then
	    update fact_clientes set is_vetado = 1 where id_cliente = new.id_cliente;
    end if;
end;
create trigger tr_delete_veto_cliente after delete on dim_veto_cliente for each row
begin
	update fact_clientes set is_vetado = 0 where id_cliente = old.id_cliente;
end;

create table dim_categoria_desistimiento(
    id_categoria int primary key auto_increment,
    categoria varchar(200) not null unique
);
insert into dim_categoria_desistimiento(categoria) values
('CALAMIDAD DOMÉSTICA'), 
('CARTERA EN MORA'), 
('CREDITO NEGADO / NO TRAMITADO'), 
('DISMINUCION DE INGRESOS'), 
('FALLECIMIENTO'), 
('INCUMPLIMIENTO EN TRAMITES'), 
('NO CERRO NEGOCIO'), 
('PERDIDA DE EMPLEO'), 
('TRÁMITES'), 
('TRASLADO DE PROYECTO'), 
('VOLUNTAD PROPIA"');

create table dim_penalidad_desistimiento(
    id_penalidad int primary key auto_increment,
    penalidad varchar(200) not null unique,
    campo varchar(50)
);
insert into dim_penalidad_desistimiento(penalidad, campo) values
('Sí (Cálculo automático)', NULL), 
('Sí (Cálculo manual)', 'Monto'), 
('Sí (Por porcentaje)', 'Porcentaje'), 
('No, Sin Penalidad', NULL), 
('No (Devolución total)', NULL);


create table fact_lista_espera(
    id_lista int primary key auto_increment,
    id_cliente int not null references fact_clientes(id_cliente),
    id_usuario int not null references fact_usuarios(id_usuario),
	id_proyecto int not null references fact_proyectos(id_proyecto),
    id_unidad int references fact_unidades(id_unidad),
	id_torre int references fact_torres(id_torre),
	piso int,
	id_tipo int references dim_tipo_unidad(id_tipo),
	id_clase int references dim_tipo_proyecto(id_tipo_proyecto),
	localizacion varchar(50),
	num_alcobas int,
	num_banos int,
	asoleacion varchar(50),
	altura varchar(50),
	cerca_porteria bit default 0,
	cerca_juegos_infantiles bit default 0,
	cerca_piscina bit default 0,
	tiene_balcon bit default 0,
	tiene_parq_sencillo bit default 0,
	tiene_parq_doble bit default 0,
	tiene_deposito bit default 0,
	tiene_acabados bit default 0,
    seguimiento text,
    is_waiting bit default 1,
    is_active bit default 1,
    created_on datetime default current_timestamp
);

create trigger tr_tarea_unidad_liberada after update on fact_unidades for each row
begin
    if new.id_estado_unidad = 1 and old.id_estado_unidad != 1 then
        insert into dim_tarea_usuario
            (alta, deadline, id_proyecto, descripcion, id_prioridad, id_estado, id_usuario)
        select 
            current_date as alta, 
            date_add(current_date, interval 1 week) as deadline, 
            new.id_proyecto as id_proyecto,
            concat('Liberación unidad T', 
                (select t.consecutivo from fact_torres t where t.id_torre = new.id_torre), 
                ' - ', (select tp.codigo from dim_tipo_proyecto tp where tp.id_tipo_proyecto = new.id_clase), 
                ' ', new.numero_apartamento, '. Revisar coincidencias en listas de espera.') as descripcion,
            2 as id_prioridad, 
            1 as id_estado, 
            l.id_usuario as id_usuario
        from fact_lista_espera l
        join fact_clientes c on l.id_cliente = c.id_cliente 
        where l.is_active = 1 and l.is_waiting = 1 and l.id_proyecto = new.id_proyecto
            and (l.id_unidad is null or l.id_unidad = new.id_unidad)
            and (l.id_torre is null or l.id_torre = new.id_torre)
            and (l.piso is null or l.piso = new.piso)
            and (l.id_tipo is null or l.id_tipo = new.id_tipo)
            and (l.id_clase is null or l.id_clase = new.id_clase)
            and (l.localizacion is null or l.localizacion = new.localizacion)
            and (l.num_alcobas is null or l.num_alcobas = new.num_alcobas)
            and (l.num_banos is null or l.num_banos = new.num_banos)
            and (l.asoleacion is null or l.asoleacion = new.asoleacion)
            and (l.altura is null or (l.piso is null and l.altura = new.altura))
            and (l.cerca_porteria = 0 or (l.cerca_porteria = 1 and new.cerca_porteria = 1))
            and (l.cerca_juegos_infantiles = 0 or (l.cerca_juegos_infantiles = 1 and new.cerca_juegos_infantiles = 1))
            and (l.cerca_piscina = 0 or (l.cerca_piscina = 1 and new.cerca_piscina = 1))
            and (l.tiene_balcon = 0 or (l.tiene_balcon = 1 and new.tiene_balcon = 1))
            and (l.tiene_parq_sencillo = 0 or (l.tiene_parq_sencillo = 1 and new.tiene_parq_sencillo = 1))
            and (l.tiene_parq_doble = 0 or (l.tiene_parq_doble = 1 and new.tiene_parq_doble = 1))
            and (l.tiene_deposito = 0 or (l.tiene_deposito = 1 and new.tiene_deposito = 1))
            and (l.tiene_acabados = 0 or (l.tiene_acabados = 1 and new.tiene_acabados = 1))
        group by l.id_usuario;

        update fact_lista_espera l
        join (
            select l.id_lista
            from fact_lista_espera l
            where l.is_active = 1 and l.is_waiting = 1 and l.id_proyecto = new.id_proyecto
                and (l.id_unidad is null or l.id_unidad = new.id_unidad)
                and (l.id_torre is null or l.id_torre = new.id_torre)
                and (l.piso is null or l.piso = new.piso)
                and (l.id_tipo is null or l.id_tipo = new.id_tipo)
                and (l.id_clase is null or l.id_clase = new.id_clase)
                and (l.localizacion is null or l.localizacion = new.localizacion)
                and (l.num_alcobas is null or l.num_alcobas = new.num_alcobas)
                and (l.num_banos is null or l.num_banos = new.num_banos)
                and (l.asoleacion is null or l.asoleacion = new.asoleacion)
                and (l.altura is null or (l.piso is null and l.altura = new.altura))
                and (l.cerca_porteria = 0 or (l.cerca_porteria = 1 and new.cerca_porteria = 1))
                and (l.cerca_juegos_infantiles = 0 or (l.cerca_juegos_infantiles = 1 and new.cerca_juegos_infantiles = 1))
                and (l.cerca_piscina = 0 or (l.cerca_piscina = 1 and new.cerca_piscina = 1))
                and (l.tiene_balcon = 0 or (l.tiene_balcon = 1 and new.tiene_balcon = 1))
                and (l.tiene_parq_sencillo = 0 or (l.tiene_parq_sencillo = 1 and new.tiene_parq_sencillo = 1))
                and (l.tiene_parq_doble = 0 or (l.tiene_parq_doble = 1 and new.tiene_parq_doble = 1))
                and (l.tiene_deposito = 0 or (l.tiene_deposito = 1 and new.tiene_deposito = 1))
                and (l.tiene_acabados = 0 or (l.tiene_acabados = 1 and new.tiene_acabados = 1))
        ) t on l.id_lista = t.id_lista
        set l.is_waiting = 0;
    end if;
end;


create trigger tr_unidades_en_venta_torre after update on fact_torres for each row
begin
    if new.en_venta = 1 and old.en_venta = 0 then
        INSERT INTO dim_tarea_usuario
            (alta,
             deadline,
             id_proyecto,
             descripcion,
             id_prioridad,
             id_estado,
             id_usuario)
        SELECT
            CURRENT_DATE                                     AS alta,
            DATE_ADD(CURRENT_DATE, INTERVAL 1 WEEK)          AS deadline,
            u.id_proyecto                                    AS id_proyecto,
            CONCAT('Torre ', new.consecutivo, ' en venta, revisar nuevas unidades libres en lista de espera.') AS descripcion,
            2                                                AS id_prioridad,
            1                                                AS id_estado,
            l.id_usuario                                     AS id_usuario
        FROM fact_unidades u
        JOIN dim_tipo_proyecto tp
          ON tp.id_tipo_proyecto = u.id_clase
        JOIN fact_lista_espera l
          ON l.id_proyecto = u.id_proyecto
         AND (l.id_unidad           IS NULL OR l.id_unidad = u.id_unidad)
         AND (l.id_torre            IS NULL OR l.id_torre = u.id_torre)
         AND (l.piso                IS NULL OR l.piso = u.piso)
         AND (l.id_tipo             IS NULL OR l.id_tipo = u.id_tipo)
         AND (l.id_clase            IS NULL OR l.id_clase = u.id_clase)
         AND (l.localizacion        IS NULL OR l.localizacion = u.localizacion)
         AND (l.num_alcobas         IS NULL OR l.num_alcobas = u.num_alcobas)
         AND (l.num_banos           IS NULL OR l.num_banos = u.num_banos)
         AND (l.asoleacion          IS NULL OR l.asoleacion = u.asoleacion)
         AND (l.altura              IS NULL
              OR (l.piso IS NULL AND l.altura = u.altura))
         AND (l.cerca_porteria          = 0
              OR (l.cerca_porteria       = 1
                  AND u.cerca_porteria   = 1))
         AND (l.cerca_juegos_infantiles = 0
              OR (l.cerca_juegos_infantiles      = 1
                  AND u.cerca_juegos_infantiles = 1))
         AND (l.cerca_piscina = 0
              OR (l.cerca_piscina      = 1
                  AND u.cerca_piscina = 1))
         AND (l.tiene_balcon = 0
              OR (l.tiene_balcon     = 1
                  AND u.tiene_balcon = 1))
         AND (l.tiene_parq_sencillo = 0
              OR (l.tiene_parq_sencillo      = 1
                  AND u.tiene_parq_sencillo = 1))
         AND (l.tiene_parq_doble = 0
              OR (l.tiene_parq_doble      = 1
                  AND u.tiene_parq_doble = 1))
         AND (l.tiene_deposito = 0
              OR (l.tiene_deposito      = 1
                  AND u.tiene_deposito = 1))
         AND (l.tiene_acabados = 0
              OR (l.tiene_acabados      = 1
                  AND u.tiene_acabados = 1))
        JOIN fact_clientes c
          ON c.id_cliente = l.id_cliente
        WHERE u.id_torre         = NEW.id_torre
          AND u.id_estado_unidad = 1 and l.is_active = 1 and l.is_waiting = 1
        GROUP BY u.id_torre, l.id_usuario;
        
        UPDATE fact_lista_espera l
        JOIN fact_unidades u
          ON l.id_proyecto = u.id_proyecto
         AND (l.id_unidad           IS NULL OR l.id_unidad = u.id_unidad)
         AND (l.id_torre            IS NULL OR l.id_torre = u.id_torre)
         AND (l.piso                IS NULL OR l.piso = u.piso)
         AND (l.id_tipo             IS NULL OR l.id_tipo = u.id_tipo)
         AND (l.id_clase            IS NULL OR l.id_clase = u.id_clase)
         AND (l.localizacion        IS NULL OR l.localizacion = u.localizacion)
         AND (l.num_alcobas         IS NULL OR l.num_alcobas = u.num_alcobas)
         AND (l.num_banos           IS NULL OR l.num_banos = u.num_banos)
         AND (l.asoleacion          IS NULL OR l.asoleacion = u.asoleacion)
         AND (l.altura              IS NULL
              OR (l.piso IS NULL AND l.altura = u.altura))
         AND (l.cerca_porteria          = 0
              OR (l.cerca_porteria       = 1
                  AND u.cerca_porteria   = 1))
         AND (l.cerca_juegos_infantiles = 0
              OR (l.cerca_juegos_infantiles      = 1
                  AND u.cerca_juegos_infantiles = 1))
         AND (l.cerca_piscina = 0
              OR (l.cerca_piscina      = 1
                  AND u.cerca_piscina = 1))
         AND (l.tiene_balcon = 0
              OR (l.tiene_balcon     = 1
                  AND u.tiene_balcon = 1))
         AND (l.tiene_parq_sencillo = 0
              OR (l.tiene_parq_sencillo      = 1
                  AND u.tiene_parq_sencillo = 1))
         AND (l.tiene_parq_doble = 0
              OR (l.tiene_parq_doble      = 1
                  AND u.tiene_parq_doble = 1))
         AND (l.tiene_deposito = 0
              OR (l.tiene_deposito      = 1
                  AND u.tiene_deposito = 1))
         AND (l.tiene_acabados = 0
              OR (l.tiene_acabados      = 1
                  AND u.tiene_acabados = 1))
        SET l.is_waiting = 0
        WHERE u.id_torre         = NEW.id_torre
          AND u.id_estado_unidad = 1 and l.is_active = 1 and l.is_waiting = 1;
    end if;
end;


create table fact_ventas(
    id_venta int primary key auto_increment,
    radicado int unique key,
    id_unidad int not null references fact_unidades(id_unidad),
    id_cliente int not null references fact_clientes(id_cliente),
    created_on datetime default current_timestamp,
    created_by varchar(50) not null
);

create table dim_estado_desistimiento(
    id_estado int primary key auto_increment,
    nombre varchar(50) not null unique
);

insert into dim_estado_desistimiento(nombre) values
('Iniciado'),
('Solicitado'),
('Dirección'),
('Coordinación'),
('Aprobado'),
('Terminado');

create table dim_desistimiento(
    id_desistimiento int primary key auto_increment,
    id_venta int not null references fact_ventas(id_venta),
    id_estado int not null default 1 references dim_estado_desistimiento(id_estado),
    ultima_fecha datetime not null,
    cant_incumplida int default 0,
    interes decimal(20, 2),
    gasto decimal(20, 2),
    descuento decimal(20, 2),
    id_categoria int references dim_categoria_desistimiento(id_categoria),
    id_fiduciaria int references dim_fiduciaria(id_fiduciaria),
    etapa varchar(20),
    id_penalidad int references dim_penalidad_desistimiento(id_penalidad),
    observacion text,
    fecha_resolucion datetime,
    created_on datetime default current_timestamp,
    created_by varchar(50) not null
);
