drop procedure if exists fn_list;
create procedure fn_list(
	in p_text text,
    in p_separator varchar(1)
) begin
	drop table if exists fn_list_result;
    create temporary table fn_list_result(id int auto_increment, value text, constraint pk_id primary key(id));
	set @Pos1 = 1,
        @Pos2 = locate(p_separator, p_text, 1);
	while @Pos2 != 0 do
		insert into fn_list_result (value)
		select substring(p_text, @Pos1, @Pos2 - @Pos1)
        where substring(p_text, @Pos1, @Pos2 - @Pos1) != '';

		set @Pos1 = @Pos2 + 1;
		set @Pos2 = locate(p_separator, p_text, @Pos2 + 1);
	end while;
end;