drop procedure if exists fn_emails;
create procedure fn_emails(in p_emails text) 
begin
	set @i = 0;
	set @length = JSON_LENGTH(p_emails);
	while @i < @length do
		set @id = json_unquote(json_extract(p_emails, concat('$[',@i,'].id_email')));
		set @email = json_unquote(json_extract(p_emails, concat('$[',@i,'].email')));
		update dim_email_receptor 
			set email = if(@email = '', NULL, @email)
			where id_email = @id;
--		insert into AuditoriaSQL(operacion, datos) values('fn_emails', json_unquote(json_extract(p_emails, concat('$[',@i,']'))));
		set @i = @i + 1;
	end while;
end;