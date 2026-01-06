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
('VOLUNTAD PROPIA');

create table dim_penalidad_desistimiento(
    id_penalidad int primary key auto_increment,
    penalidad varchar(200) not null unique,
    campo varchar(50)
);
insert into dim_penalidad_desistimiento(penalidad, campo) values
('Sí (Cálculo automático)', NULL), 
('Sí (Cálculo manual)', 'Monto'), 
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
    salesforce_id varchar(50),
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


create table fact_cotizacion_cliente(
    id_cotizacion_cliente int primary key auto_increment,
    id_cliente int not null references fact_clientes(id_cliente),
    id_cotizacion int not null references fact_cotizaciones(id_cotizacion),
    constraint uk_cliente_cotizacion unique (id_cliente, id_cotizacion)
);

create table fact_opcion (
    id_opcion int primary key auto_increment,
    id_cotizacion int not null,
    fecha_entrega date not null,
    created_on datetime default current_timestamp,
    created_by varchar(50) not null,

    valor_reformas decimal(20,2) default 0,
    valor_acabados decimal(20,2) default 0,
    valor_descuento_adicional decimal(20,2) default 0,
    valor_separacion decimal(20,2) default 0,
    valor_escrituras decimal(20,2) default 0,
    notariales decimal(20,2) default 0,
    beneficiencia decimal(20,2) default 0,
    registro decimal(20,2) default 0,
    pago_contado bit default 0,
    pago_financiado bit default 0,
    id_entidad int,
    id_tipo int,
    id_anios int,
    id_modalidad int,
    subsidio_activo bit default 0,
    ingresos_familiares decimal(20, 2) default 0,
    cesantias decimal(20, 2) default 0,
    ahorros decimal(20, 2) default 0,
    fin_max_permisible decimal(20, 2) default 0,
    cuota_permisible decimal(20, 2) default 0,
    cuota_max_financiable decimal(20, 2) default 0,
    ingr_regs_max decimal(20, 2) default 0,
    anio_entrega int,
    valor_subsidio decimal(20,2) default 0,
    id_caja_compensacion int,
    meses int,
    importe_financiacion decimal(20, 2) default 0,
    cuota_inicial decimal(20, 2) default 0,
    fecha_primera_cuota date,
    fecha_ultima_cuota date,
    fecha_escrituracion date,
    id_banco_factor int references dim_banco_factor(id_banco_factor),
    id_pie_legal int references dim_pie_legal(id_pie_legal),

    constraint fk_fact_opcion_cot foreign key (id_cotizacion)
        references fact_cotizaciones(id_cotizacion)
);

create table fact_ventas(
    id_venta int primary key auto_increment,
    id_opcion int not null references fact_opcion(id_opcion),
    id_sala_venta int not null references dim_sala_venta(id_sala_venta),
    created_on datetime default current_timestamp,
    created_by varchar(50) not null
);

create table dim_estado_desistimiento(
    id_estado int primary key auto_increment,
    nombre varchar(50) not null unique
);

insert into dim_estado_desistimiento(nombre) values
('Iniciado'),
('En Espera Coordinación/Dirección'),
('En Espera Gerencia'),
('Aprobado'),
('Terminado'),
('Cancelado');

create table dim_desistimiento(
    id_desistimiento int primary key auto_increment,
    id_venta int not null references fact_ventas(id_venta),
    id_estado int not null default 1 references dim_estado_desistimiento(id_estado),
    radicado int not null unique key,
    ultima_fecha datetime,
    cant_incumplida int default 0,
    interes decimal(20, 2),
    gasto decimal(20, 2),
    descuento decimal(20, 2),
    pnl_monto decimal(20, 2),
    v_venta_neto decimal(20, 2),
    a_capital decimal(20, 2),
    a_intereses decimal(20, 2),
    condonacion decimal(20, 2),
    imp_reformas decimal(20, 2),
    pnl_pcv decimal(20, 2),
    pnl_aplicada_ptg decimal(20, 2),
    id_categoria int not null references dim_categoria_desistimiento(id_categoria),
    id_fiduciaria int not null references dim_fiduciaria(id_fiduciaria),
    etapa not null varchar(20),
    id_penalidad int not null references dim_penalidad_desistimiento(id_penalidad),
    id_unidad int not null references fact_unidades(id_unidad),
    observacion text,
    fecha_resolucion date,
    fecha_fpc date,
    fecha_program date,
    com_coordinacion text,
    fec_com_coordinacion date,
    com_gerencia text,
    fec_com_gerencia date,
    fec_prorroga_carta date,
    extra_prorroga_carta decimal(20, 2),
    devolver_reforma bit,
    carta_cong bit default 0,
    created_on datetime default current_timestamp,
    created_by varchar(50) not null,
    updated_by varchar(50) not null,
    updated_on datetime default current_timestamp on update current_timestamp
);
create table dim_cuenta_opcion(
    id_cuenta int primary key auto_increment,
    id_opcion int not null references fact_opcion(id_opcion),
    id_cliente int not null references fact_clientes(id_cliente),
    entidad varchar(100),
    tipo_cuenta varchar(100),
    numero_cuenta varchar(100),
    porcentaje decimal(5, 2) not null,
    constraint chk_valor_entre_1_y_100 check (porcentaje between 1 and 100),
    tipo_giro varchar(50)
);

create trigger tr_insert_estado_desistimiento after insert on dim_desistimiento for each row
begin
    insert into dim_log_unidades (id_unidad, id_usuario, titulo, texto)
    select coalesce(u2.id_unidad, u1.id_unidad) as id_unidad, u.id_usuario, 'Nuevo desistimiento', 
        concat('Se ha creado un nuevo desistimiento con <b># radicado ', new.radicado, '</b>.')
    from fact_ventas v 
    join fact_unidades u1 on new.id_unidad = u1.id_unidad
    left join fact_unidades u2 on u1.id_agrupacion = u2.id_agrupacion
    join fact_usuarios u on new.created_by = u.usuario collate utf8mb4_general_ci 
    where v.id_venta = new.id_venta;

    if new.id_estado = 2 then
        insert into dim_log_unidades (id_unidad, id_usuario, titulo, texto)
        select coalesce(u2.id_unidad, u1.id_unidad) as id_unidad, u.id_usuario, 'Desistimiento solicitado', 
            concat('El desistimiento con <b># radicado ', new.radicado, '</b> ha sido solicitado.')
        from fact_ventas v 
        join fact_unidades u1 on new.id_unidad = u1.id_unidad
        left join fact_unidades u2 on u1.id_agrupacion = u2.id_agrupacion
        join fact_usuarios u on new.created_by = u.usuario collate utf8mb4_general_ci 
        where v.id_venta = new.id_venta;

        insert into dim_tarea_usuario
            (alta, deadline, id_proyecto, descripcion, id_prioridad, id_estado, id_usuario)
        select current_date, date_add(current_date, interval 1 week), un.id_proyecto, 
            concat('Pendiente Aprobación (Coordinación) de desisitimiento # radicado ', new.radicado), 2, 1, sv.id_cordinador
        from fact_ventas v
        join fact_unidades un on new.id_unidad = un.id_unidad
        join dim_sala_venta sv on v.id_sala_venta = sv.id_sala_venta
        where v.id_venta = new.id_venta;
    end if;
end;

create trigger tr_update_estado_desistimiento after update on dim_desistimiento for each row
begin
    if new.id_estado != old.id_estado then
        
        set @title = CASE 
            WHEN new.id_estado = 2 THEN 'Desistimiento solicitado'
            WHEN new.id_estado = 3 THEN 'Desistimiento aprobado por coordinación/dirección'
            WHEN new.id_estado = 4 THEN 'Desistimiento aprobado por gerencia'
            WHEN new.id_estado = 5 THEN 'Desistimiento terminado'
            WHEN new.id_estado = 6 THEN 'Desistimiento cancelado'
            ELSE ''
        END, @desc = CASE 
            WHEN new.id_estado = 2 THEN concat('El desistimiento con <b># radicado ', new.radicado, '</b> ha sido solicitado.')
            WHEN new.id_estado = 3 THEN concat('El desistimiento con <b># radicado ', new.radicado, 
                '</b> ha sido aprobado por coordinación/direccion.</br><ul><li>Comentario: ', ifnull(new.com_coordinacion, 'Sin comentario.'), '</li></ul>')
            WHEN new.id_estado = 4 THEN concat('El desistimiento con <b># radicado ', new.radicado, 
                '</b> ha sido aprobado por gerencia.</br><ul><li>Comentario: ', ifnull(new.com_gerencia, 'Sin comentario.'), '</li></ul>')
            WHEN new.id_estado = 5 THEN concat('El desistimiento con <b># radicado ', new.radicado, '</b> ha sido terminado.')
            WHEN new.id_estado = 6 THEN concat('El desistimiento con <b># radicado ', new.radicado, '</b> ha sido cancelado.</br><ul><li>Comentario: ', 
                if(old.id_estado = 2, ifnull(new.com_coordinacion, 'Sin comentario.'), ifnull(new.com_gerencia, 'Sin comentario.')), '</li></ul>')
            ELSE ''
        END; 
       
        insert into dim_log_unidades (id_unidad, id_usuario, titulo, texto)
        select coalesce(u2.id_unidad, u1.id_unidad) as id_unidad, u.id_usuario, @title, @desc
        from fact_ventas v 
        join fact_unidades u1 on new.id_unidad = u1.id_unidad
        left join fact_unidades u2 on u1.id_agrupacion = u2.id_agrupacion
        join fact_usuarios u on new.created_by = u.usuario collate utf8mb4_general_ci 
        where v.id_venta = new.id_venta;

        if new.id_estado = 2 then
            insert into dim_tarea_usuario
                (alta, deadline, id_proyecto, descripcion, id_prioridad, id_estado, id_usuario)
            select current_date, date_add(current_date, interval 1 week), un.id_proyecto, 
                concat('Pendiente Aprobación (Coordinación) de desisitimiento # radicado ', new.radicado), 2, 1, sv.id_cordinador
            from fact_ventas v
            join fact_unidades un on new.id_unidad = un.id_unidad
            join dim_sala_venta sv on v.id_sala_venta = sv.id_sala_venta
            where v.id_venta = new.id_venta;
        end if;

        if new.id_estado = 3 then
            insert into dim_tarea_usuario
                (alta, deadline, id_proyecto, descripcion, id_prioridad, id_estado, id_usuario)
            select current_date, date_add(current_date, interval 1 week), un.id_proyecto, 
                concat('Pendiente Aprobación (Gerencia) de desisitimiento # radicado ', new.radicado), 2, 1, s.id_gerente
            from fact_ventas v
            join fact_unidades un on new.id_unidad = un.id_unidad
            join dim_sala_venta sv on v.id_sala_venta = sv.id_sala_venta
            join dim_sede s on sv.id_sede = s.id_sede
            where v.id_venta = new.id_venta;
        end if;
    end if;
end;


create table dim_whitelist_views(
    name varchar(50) primary key
);
insert into dim_whitelist_views(name) values('dash_unidades');
