-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 22, 2025 at 06:25 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `agencia_paquetes`
--

-- --------------------------------------------------------

--
-- Table structure for table `compra`
--

CREATE TABLE `compra` (
  `id_compra` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_paquete` int(11) NOT NULL,
  `fecha_compra` date NOT NULL,
  `estado` varchar(20) DEFAULT 'pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `compra`
--

INSERT INTO `compra` (`id_compra`, `id_usuario`, `id_paquete`, `fecha_compra`, `estado`) VALUES
(2, 8, 4, '2025-06-20', 'Cancelado'),
(215, 8, 7, '2025-06-13', 'Entregado'),
(216, 8, 6, '2025-06-01', 'Anulado'),
(217, 9, 5, '2025-06-17', 'Pendiente');

-- --------------------------------------------------------

--
-- Table structure for table `paquete`
--

CREATE TABLE `paquete` (
  `id_paquete` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `destino` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `paquete`
--

INSERT INTO `paquete` (`id_paquete`, `nombre`, `descripcion`, `precio`, `destino`) VALUES
(4, 'Paraíso Caribeño', 'Disfrutá de 7 días y 6 noches en un resort all-inclusive frente al mar Caribe. Incluye vuelos ida y vuelta, traslados al hotel, actividades acuáticas y excursión a la Isla Saona.', 1200.00, 'Punta Cana, República Dominicana'),
(5, 'Aventura Andina', 'Conocé el corazón del Imperio Inca con este tour de 5 días. Incluye alojamiento con desayuno, guía profesional, entradas a Machu Picchu y tren panorámico.', 890.00, 'Cusco y Machu Picchu, Perú'),
(6, 'Romance en París', 'Paquete de 6 noches en hotel boutique cerca de la Torre Eiffel. Incluye vuelos, desayuno continental, crucero por el Sena, entradas al Louvre y cena romántica.', 2150.00, 'París, Francia'),
(7, 'Safari Africano', 'Explorá la vida salvaje africana con este tour de 4 días y 3 noches. Incluye safaris en 4x4, guía experto, hospedaje en lodge con pensión completa y traslados.', 1780.00, 'Parque Nacional Kruger, Sudáfrica'),
(8, 'Escapada Urbana', 'Conocé la ciudad que nunca duerme con este paquete de 5 días. Incluye vuelos, hotel céntrico en Manhattan, entradas al Empire State y tour por Central Park y Times Square.', 1450.00, 'Nueva York, Estados Unidos');

-- --------------------------------------------------------

--
-- Table structure for table `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `admin` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `nombre`, `apellido`, `email`, `contraseña`, `telefono`, `admin`) VALUES
(1, 'Jesus Daniel', 'Baute Araujo', 'jesusdanielba29@gmail.com', '$2b$08$VVLCZku3YZ.ybGM4dJQzlO2Wh1LRMkNcCk1FaA3R.AmWhMkE/I.JC', '01154863480', 0),
(7, 'leon', 'Beltarn', 'albertoCarlos@gmail.com', '$2b$08$61uMcxzyaCH2LAw3F76nI.Lu1yg47EqZlwWrb1Kxa.F4gEMIAcTwS', '01154863480', 0),
(8, 'pato', 'pato', 'pato@pato.pato', '$2b$08$VDnltvPgKU2uAXLswZBf5eI.6BuvW2XRlihjUYO/18IaOY2YNEKeu', '123', 0),
(9, 'admin', 'admin', 'admin@agenciaturismo.com', '$2b$08$x9UjIlrYkV8aZqM0io7nSurN/qai1iC8WGTEUpHHyZxcstvAK7QG.', '1231024141', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `compra`
--
ALTER TABLE `compra`
  ADD PRIMARY KEY (`id_compra`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_paquete` (`id_paquete`);

--
-- Indexes for table `paquete`
--
ALTER TABLE `paquete`
  ADD PRIMARY KEY (`id_paquete`);

--
-- Indexes for table `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `compra`
--
ALTER TABLE `compra`
  MODIFY `id_compra` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=218;

--
-- AUTO_INCREMENT for table `paquete`
--
ALTER TABLE `paquete`
  MODIFY `id_paquete` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `compra`
--
ALTER TABLE `compra`
  ADD CONSTRAINT `compra_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  ADD CONSTRAINT `compra_ibfk_2` FOREIGN KEY (`id_paquete`) REFERENCES `paquete` (`id_paquete`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
