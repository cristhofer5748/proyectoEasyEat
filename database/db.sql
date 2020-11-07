--creando la base de datos
CREATE DATABASE easyeat;

--utilizando la base de datos
use easyeat;

--creando TABLA PRODUCTOS--
CREATE TABLE productos(
    id INT(11) NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    preciocompra INT(100) NOT NULL,
    precioventa INT(100) NOT NULL,
    cantidadTotal INT(100) NOT NULL
    
);

ALTER TABLE productos
    ADD PRIMARY KEY (id);


ALTER TABLE productos
    MODIFY id INT NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--creando TABLA empleados--
CREATE TABLE empleados(
    id INT(11) NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    puesto VARCHAR(100) NOT NULL,
    correo varchar(100) NOT NULL,
    contrasena varchar(100) NOT NULL
    
);

ALTER TABLE empleados
    ADD PRIMARY KEY (id);


ALTER TABLE empleados
    MODIFY id INT NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;


--creando tabla productomaquina
CREATE TABLE productomaquina(
    id INT(11) NOT NULL,
    idproducto int(11) NOT NULL,
    idmaquina int(11) NOT NULL,
    cantidadmaquina int(11) NOT NULL
    
    
);

ALTER TABLE productomaquina
    ADD PRIMARY KEY (id);

ALTER TABLE productomaquina
    ADD CONSTRAINT fk_productomaquina FOREIGN KEY (idproducto) REFERENCES productos(id);

ALTER TABLE productomaquina
    ADD CONSTRAINT fk_maquinadellenado FOREIGN KEY (idmaquina) REFERENCES maquinas(id);

ALTER TABLE productomaquina
    MODIFY id INT NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--creando tabla maquina
CREATE TABLE maquinas(
    id INT(11) NOT NULL,
    nombre int(11) NOT NULL,
    longitud float(11,11) NOT NULL,
    latitud float(11,11) NOT NULL,
    fecharevision date NOT NULL
    
    
);

ALTER TABLE maquinas
    ADD PRIMARY KEY (id);


ALTER TABLE maquinas
    MODIFY id INT NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--creando tabla rutas
CREATE TABLE rutas(
    id INT(11) NOT NULL,
    idempleado int(11) not null,
    idmaquina int(11) not null
);
ALTER TABLE rutas
    ADD PRIMARY KEY (id);

ALTER TABLE rutas
    ADD CONSTRAINT fk_empleadoruta FOREIGN KEY (idempleado) REFERENCES empleados(id);
ALTER TABLE rutas
    ADD CONSTRAINT fk_maquinaruta FOREIGN KEY (idmaquina) REFERENCES maquinas(id);

ALTER TABLE rutas
    MODIFY id INT NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--creando tablas reportechequeo
CREATE TABLE reportechequeo(
    id INT(11) NOT NULL,
    idempleado int(11) not null,
    idmaquina int(11) not null,
    fechahora datetime not null,
    productomasvendido varchar(60) not null,
    productomenosvendido varchar(60) not null,
    totalproductos int(11) not null,
    totalventas int(11) not null
    
);


ALTER TABLE reportechequeo
    ADD PRIMARY KEY (id);
ALTER TABLE reportechequeo
    ADD CONSTRAINT fk_empleado FOREIGN KEY (idempleado) REFERENCES empleados(id);
ALTER TABLE reportechequeo
    ADD CONSTRAINT fk_maquina FOREIGN KEY (idmaquina) REFERENCES maquinas(id);


ALTER TABLE reportechequeo
    MODIFY id INT NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
    
