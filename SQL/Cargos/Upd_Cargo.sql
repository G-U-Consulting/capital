-- =============================================
-- Proceso: Usuarios/Upd_Usuario
-- =============================================
--START_PARAM
set
    @Cargo = "admin",
    @Descripcion = "",
    @id_cargo = '1'
--END_PARAM

UPDATE dim_cargo 
SET Cargo = @Cargo,
    Descripcion = @Descripcion
WHERE id_cargo = @id_cargo;


select 'OK' as result;