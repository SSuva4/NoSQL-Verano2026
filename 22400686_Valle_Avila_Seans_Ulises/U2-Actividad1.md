1.Mostrar todos los libros publicados después del año 2022.
db["Libros"].find({ añoPublicacion: { $gt: 2022 } })

2.Mostrar los usuarios cuya edad sea mayor o igual a 21 años.
db["Usuarios"].find({ edad: { $gte: 21 } })

3.Mostrar los libros con menos de 350 páginas.
db["Libros"].find({ paginas: { $lt: 350 } })

4.Mostrar los usuarios cuya edad sea menor o igual a 20 años.
db["Usuarios"].find({ edad: { $lte: 20 } })

5.Mostrar los libros cuya categoría sea diferente de "Programación".
db["Libros"].find({ categoria: { $ne: "Programación" } })

6.Mostrar los usuarios que estudien Ingeniería Informática y estén en sexto semestre o superior.
db["Usuarios"].find({ carrera: "Ingeniería Informática", semestre: { $gte: 6 } })

7.Mostrar los libros cuya categoría sea Programación o Bases de Datos.
db["Libros"].find({ categoria: { $in: ["Programación", "Bases de Datos"] } })

8.Mostrar los préstamos que no han sido devueltos y cuya duración sea mayor a 8 días.
db["Prestamos"].find({ devuelto: false, diasPrestamo: { $gt: 8 } })

9.Mostrar los libros cuyo título empiece con la letra M.
db["Libros"].find({ titulo: { $regex: "^M" } })

10.Mostrar los usuarios cuyo nombre empiece con la letra A.
db["Usuarios"].find({ nombre: { $regex: "^A" } })

11.Mostrar los libros cuyo título contenga la palabra "Base".
db["Libros"].find({ titulo: { $regex: "Base" } })

12.Mostrar únicamente el nombre y la carrera de todos los usuarios.
db["Usuarios"].find({}, { nombre: 1, carrera: 1, _id: 0 })

13.Mostrar únicamente el título y el autor de todos los libros.
db["Libros"].find({}, { titulo: 1, autor: 1, _id: 0 })

14.Mostrar únicamente el usuario y el libro de todos los préstamos.
db["Prestamos"].find({}, { usuario: 1, libro: 1, _id: 0 })

15.Mostrar los libros ordenados por año de publicación, del más reciente al más antiguo.
db["Libros"].find().sort({ anioPublicacion: -1 })

16.Mostrar los usuarios ordenados alfabéticamente por nombre.
db["Usuarios"].find().sort({ nombre: 1 })

17.Mostrar los préstamos ordenados por la cantidad de días de préstamo, del mayor al menor.
db["Prestamos"].find().sort({ diasPrestamo: -1 })

18.Mostrar únicamente el título y el año de los libros publicados a partir de 2022, ordenados del más reciente al más antiguo.
db["Libros"].find({ añoPublicacion: { $gte: 2022 } }, { titulo: 1, añoPublicacion: 1, _id: 0 }).sort({ añoPublicacion: -1 })

19.Mostrar el nombre y la carrera de los usuarios cuya carrera sea Ingeniería en Sistemas Computacionales o Ingeniería Informática.
db["Usuarios"].find({ carrera: { $in: ["Ingeniería en Sistemas Computacionales", "Ingeniería Informática"] } }, { nombre: 1, carrera: 1, _id: 0 })
        
20.Mostrar los préstamos no devueltos, ordenados por la cantidad de días de préstamo de mayor a menor, mostrando únicamente el usuario, el libro y los días de préstamo
db["Prestamos"].find({ devuelto: false }, { usuario: 1, libro: 1, diasPrestamo: 1, _id: 0 }).sort({ diasPrestamo: -1 })  
