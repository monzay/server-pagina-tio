import express from "express";
import cors from "cors";
import morgan from "morgan";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import path from "path"




const ruta = path.resolve("./datos/database.json")

const renombraArchivo = (file) => {
  const newNombre = `./uploads/${file.originalname}`;
  fs.rename(file.path, newNombre);
};

const creadorDeIndentificadorUnicoProducto = async () => {

    const allIdentidicadoresExitentes = [];
    const dataJson = await fs.readFile(ruta, "utf-8");
    const data = await JSON.parse(dataJson);
    if (data.length >= 1) {
      for (let i = 0; i < data.length; i++) {
        allIdentidicadoresExitentes.push(data[i].id);
      }
    }

    let identificadorProducto;
    do {
      identificadorProducto = Math.floor(Math.random() * 300);
    } while (allIdentidicadoresExitentes.includes(identificadorProducto));
    return identificadorProducto;
};


const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
const upload = multer({ dest: "uploads/" });

app.use("/uploads", express.static("uploads"));

app.post("/login", (req, res) => {
  const { email, password, nombre } = req.body;
  console.log(req.body);
  if (
    nombre === "ricardo subelza" &&
    email === "ricardosubelza@gmail.com" &&
    password === "ricardo subelza"
  ) {
    res.status(200).json({ token: true });
  } else {
    res.status(500).json({ message: "che capo nose que mierda queres hacer" });
  }
});

app.post("/addImg", upload.single("img"), async (req, res) => {
  const { categoria, descripcion,precio } = req.body;
  const file = req.file;


  if (file && categoria  && precio) {
    try {
      await renombraArchivo(file);
      const dataJson = await fs.readFile(ruta, "utf-8");
      const data = JSON.parse(dataJson);
      const id = uuidv4();
      const producto = {
        categoria: categoria || null,
        descripcion: descripcion || null,
        img: file.originalname,
        id: id,
        idProducto: await  creadorDeIndentificadorUnicoProducto(),
        precio:precio 
      }; 

      data.push(producto);
      const dataStringify = JSON.stringify(data, null, 2);
      await fs.writeFile(ruta, dataStringify);

      res.status(200).json({ message: "Producto agregado con éxito." });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Error al agregar el producto." });
    }
  } else {
    res.status(500).json({ message: "¡Dale, capo, pone la img!" });
  }
});
app.get("/imgs", async (req, res) => {
  try {
    const dataJson = await fs.readFile(ruta, "utf-8");
    const data = await JSON.parse(dataJson);
    res.setHeader("Cache-Control", "no-store");
    res.status(200).json({ data: data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error" });
  }
});

app.put("/actualizar/:id", upload.single("newImg"), async (req, res) => {
  const file = req.file;
  const { id } = req.params;
  const { descripcion, categoria ,precio} = req.body;
  const logicaParaActualizarLosDatos = async (newProducto) => {
    try {
      const dataJson = await fs.readFile(ruta, "utf-8");
      const data = await JSON.parse(dataJson);
      const newData = data.map((producto) =>
        producto.id === id ? { ...producto, ...newProducto } : producto
      );
      const newDataString = JSON.stringify(newData, null, 2);
      await fs.writeFile(ruta, newDataString);
      res.status(200).json({ message: "se actualizo xon exito" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error" });
    }
  };

  if (file && categoria && descripcion && precio) {
    renombraArchivo(file);
    const newProducto = {
      img: file.originalname,
      categoria,
      descripcion,
      precio
    };
    logicaParaActualizarLosDatos(newProducto);
  } else if (!file && categoria && descripcion && precio) {
    const newProducto = {
      categoria,
      descripcion,
      precio
    };
    logicaParaActualizarLosDatos(newProducto);
  } else if (file && !categoria && descripcion && precio) {
    renombraArchivo(file);
    const newProducto = {
      img: file.originalname,
      descripcion,
      precio
    };
    logicaParaActualizarLosDatos(newProducto);
    
  } else if (file && categoria && !descripcion && precio) {
    renombraArchivo(file);
    const newProducto = {
      img: file.originalname,
      categoria,
      precio
    };
    logicaParaActualizarLosDatos(newProducto);

  } else if (file && categoria && descripcion && !precio) {
    renombraArchivo(file);
    const newProducto = {
      img: file.originalname,
      categoria,
      descripcion,
    };
    logicaParaActualizarLosDatos(newProducto);



  } else if (!file && !categoria && descripcion && precio) {
    const newProducto = {
      descripcion,
      precio
    };
    logicaParaActualizarLosDatos(newProducto);
  } else if (!file && categoria && !descripcion && precio) {
    const newProducto = {
      categoria,
      precio
    };
    logicaParaActualizarLosDatos(newProducto);
  } else if (!file && categoria && descripcion && !precio) {
    const newProducto = {
      categoria,
      descripcion,
    };
    logicaParaActualizarLosDatos(newProducto);
  } else if (file && !categoria && !descripcion && precio) {

    renombraArchivo(file);
    const newProducto = {
      img: file.originalname,
      precio,
    };
    logicaParaActualizarLosDatos(newProducto);
  } else if (file && !categoria && descripcion && !precio) {
    renombraArchivo(file);
    const newProducto = {
      img: file.originalname,
      descripcion,
    };
    logicaParaActualizarLosDatos(newProducto);
  } else if (file && categoria && !descripcion && !precio) {
    renombraArchivo(file);
    const newProducto = {
      img: file.originalname,
      categoria,
    };
    logicaParaActualizarLosDatos(newProducto);
    // descripcion y precio son null o undefined, pero las otras variables tienen un valor definido
  } else if (!file && !categoria && !descripcion && precio) {
    const newProducto = {
      precio
    };
    logicaParaActualizarLosDatos(newProducto);
  } else if (!file && !categoria && descripcion && !precio) {
    const newProducto = {
      descripcion,
    };
    logicaParaActualizarLosDatos(newProducto);
  } else if (!file && categoria && !descripcion && !precio) {
    const newProducto = {
      categoria,
    };
    logicaParaActualizarLosDatos(newProducto);
  } else if (file && !categoria && !descripcion && !precio) {
    renombraArchivo(file);
    const newProducto = {
      img: file.originalname,
    };
    logicaParaActualizarLosDatos(newProducto);
    // categoria, descripcion y precio son null o undefined, pero file tiene un valor definido
  } 

});

app.delete("/deleteImg/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const dataJson = await fs.readFile(ruta, "utf-8");
    const data = await JSON.parse(dataJson);

    const newData = data.filter((p) => p.id !== id);
    const newDataString = JSON.stringify(newData, null, 2);
    await fs.writeFile(ruta, newDataString);
    res.status(200).json({ message: "se elimino exitosamente la img" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error al agregar el producto." });
  }
});
app.listen(3000, () => {
  console.log("se escucho en el puerto 3000");
});
