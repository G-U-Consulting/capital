-- =============================================
-- Proceso: Usuarios/Ins_Cagos
-- =============================================
--START_PARAM
set @cargo = 'Gerente',
    @Descripcion = ''

--END_PARAM

IF NOT EXISTS (SELECT 1 FROM dim_cargo WHERE cargo = @cargo) THEN
    INSERT INTO dim_cargo (cargo, Descripcion) VALUES (@cargo, @Descripcion);
    SELECT concat('OK-id_cargo:', (SELECT id_cargo from dim_cargo where cargo = @cargo)) AS result;
ELSE
    SELECT 'El cargo ya existe' AS result;
END IF;
