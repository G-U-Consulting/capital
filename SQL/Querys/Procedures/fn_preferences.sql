drop procedure if exists fn_preferences;
create procedure fn_preferences(
    in p_usuario varchar(200),
    in p_nombre varchar(200),
    in p_valor text,
    in p_accion varchar(10), -- 'insert' o 'update'
    out p_result varchar(255)
)
begin
    declare v_id_usuario int;

    select id_usuario into v_id_usuario from fact_usuarios where usuario = p_usuario collate utf8mb4_unicode_ci;

    if (p_usuario is null and v_id_usuario is not null) or (p_usuario is not null and v_id_usuario is null) then
        set p_result := concat('Error: No se encontró el usuario ', p_usuario);
    else
        if p_accion = 'insert' then
            insert into dim_preferencias_usuario (id_usuario, nombre, valor)
            values (v_id_usuario, p_nombre, p_valor);
            set p_result := concat('OK-id_preferencia:', last_insert_id());
        elseif p_accion = 'update' then
            update dim_preferencias_usuario
            set valor = p_valor
            where id_usuario = v_id_usuario
              and nombre = p_nombre;
            set p_result := 'OK';
        else
            set p_result := 'Error: acción no válida';
        end if;
    end if;
end
