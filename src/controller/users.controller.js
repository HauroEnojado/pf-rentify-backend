const { User } = require("../db/db");
const { CustomError } = require("../utils/customErrors");
const { Op } = require("sequelize");
// -- Obtener ususario por id (get userById)
// -- Crear nuevo usuario (post user)
// -- Actuliazar datos de usuario (put)
// -- Eliminar usuario (delete)
// -- Obtener usurio por memebresia (get)
// Crear nuevo usuario (POST /users)

const postUser = async (req, res) => {
  try {
    const regeexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Obtén los datos del cuerpo de la solicitud
    const { name, email, phone, image, uid } = req.body;
    // Verifica si el email ya existe en la base de datos
    const existingUser = await User.findOne({ where: { email } });
    const existingUid = await User.findOne({ where: { uid } });
    // const numbeUser = await User.findOne({ where: { phone } })
    // verificacion de formato de regeex para correo electronico

    if (!regeexEmail.test(email)) {
      throw new CustomError(400, "formato de correo no valido ");
    } else if (existingUser) {
      // Si el email ya existe, devuelve una respuesta de error
      throw new CustomError(400, "Error correo existente");
    } else if (existingUid) {
      // Si el email ya existe, devuelve una respuesta de error
      throw new CustomError(400, "Error usuario registrado");
    }
    // else if (numbeUser) {
    //   throw new CustomError(400, 'Error number phone')
    // }

    // Crea un nuevo usuario en la base de datos
    const newUser = await User.create({
      name,
      email,
      phone,
      image,
      uid,
      membership: "standard",
      status: "active",
    });

    // Envía la respuesta con el usuario creado
    res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    // En caso de error, envía una respuesta de error
    res.status(error?.status || 500).json({ error: error?.message });
  }
};
// Obtener usuario por ID (GET)
const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = await User.findOne({
      where: {
        idUser: id,
      },
    });
    if (!userId) throw new CustomError(404, "usuario no existente");

    return res.status(200).json(userId);
  } catch (error) {
    res
      .status(error?.status || 500)
      .json({ error: error?.message || "Error en la busqueda de users" });
  }
};

// Llama todos los usuarios

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll(); // Consulta para obtener todos los usuarios
    // Hacer algo con los usuarios obtenidos
    console.log(users);
    // Retornar los usuarios si necesitas utilizarlos fuera de esta función

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error updating user email:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getUsersByName = async (req, res) => {
  const { name } = req.body;
  try {
    const users = await User.findAll({
      where: {
        name: { [Op.iLike]: `%${name}%` },
      },
    });

    // Hacer algo con los usuarios obtenidos por nombre
    console.log(users);

    // Retornar los usuarios si necesitas utilizarlos fuera de esta función
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error al obtener los usuarios por nombre:", error);
    throw error;
  }
};

const getUsersByStatus = async (req, res) => {
  try {
    const { status } = req.query; // Obtén el parámetro de consulta 'status'
    const users = await User.findAll({
      where: {
        status, // Filtrar por el estado proporcionado
      },
    });

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Error en la búsqueda de usuarios por estado" });
  }
};

const updateUserName = async (req, res) => {
  const { idUser, name } = req.body;

  try {
    const user = await User.findByPk(idUser);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Validar que el nuevo nombre no esté vacío
    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "Name is required" });
    }

    // Validar que el nuevo nombre tenga al menos 3 caracteres
    if (name.trim().length < 3) {
      return res
        .status(400)
        .json({ error: "Name must have at least 3 characters" });
    }
    // Actualizar el nombre del usuario
    user.name = name;
    await user.save();

    return res.status(200).json({ message: "User name updated successfully" });
  } catch (error) {
    console.error("Error updating user name:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const updateUserPhone = async (req, res) => {
  const { idUser, phone } = req.body;

  try {
    const user = await User.findByPk(idUser);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Validar que el número de teléfono sea un valor válido
    if (!phone || phone.trim() === "") {
      return res.status(400).json({ error: "Phone number is required" });
    }

    // Validar que el número de teléfono tenga al menos 6 dígitos
    if (phone.length < 5) {
      return res
        .status(400)
        .json({ error: "Phone number must have at least 6 digits" });
    }

    // Validar que el número de teléfono tenga máximo 20 dígitos
    if (phone.length > 21) {
      return res
        .status(400)
        .json({ error: "Phone number must have at most 20 digits" });
    }
    // Validar que el número de teléfono solo contenga números
    if (!/^\d+$/.test(phone)) {
      return res
        .status(400)
        .json({ error: "Phone number must contain only digits" });
    }
    // Actualizar el número de teléfono del usuario
    user.phone = phone;
    await user.save();

    return res
      .status(200)
      .json({ message: "User phone number updated successfully" });
  } catch (error) {
    console.error("Error updating user phone number:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const updateUserEmail = async (req, res) => {
  const { idUser, email } = req.body;
  const regeexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  try {
    const user = await User.findByPk(idUser);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Validar que el correo electrónico sea un valor válido
    if (!email || email.trim() === "") {
      return res.status(400).json({ error: "Email is required" });
    }

    // Validar que el correo electrónico tenga un formato válido
    if (!regeexEmail.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Actualizar el correo electrónico del usuario
    user.email = email;
    await user.save();

    return res.status(200).json({ message: "User email updated successfully" });
  } catch (error) {
    console.error("Error updating user email:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const updateUserStatus = async (req, res) => {
  const { idUser, status } = req.body;

  try {
    const user = await User.findByPk(idUser);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Validar que el estado sea un valor válido
    const allowedStatus = ["active", "inactive", "paused", "banned"];
    if (!status || !allowedStatus.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }
    // Validar que el estado no sea igual al valor actual en la base de datos
    if (status === user.status) {
      return res
        .status(400)
        .json({ error: "Status is already set to the provided value" });
    }
    // Actualizar el estado del usuario
    user.status = status;
    await user.save();

    return res
      .status(200)
      .json({ message: "User status updated successfully" });
  } catch (error) {
    console.error("Error updating user status:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
const updateUserMembership = async (req, res) => {
  const { idUser, membership } = req.body;

  try {
    const user = await User.findByPk(idUser);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Validar que el estado sea un valor válido
    const allowedMembership = ["standard", "premium"];
    if (!membership || !allowedMembership.includes(membership)) {
      return res.status(400).json({ error: "Invalid membership value" });
    }
    // Validar que el estado no sea igual al valor actual en la base de datos
    if (membership === user.membership) {
      return res
        .status(400)
        .json({ error: "Status is already set to the provided value" });
    }
    // Actualizar el estado del usuario
    user.membership = membership;
    await user.save();

    return res
      .status(200)
      .json({ message: "User status updated successfully" });
  } catch (error) {
    console.error("Error updating user status:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
const updateUserImage = async (req, res) => {
  const { idUser, image } = req.body;

  try {
    const user = await User.findByPk(idUser);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Validar que la imagen sea una URL válida
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    if (!urlRegex.test(image)) {
      return res.status(400).json({ error: "Invalid image URL" });
    }

    // Actualizar la imagen del usuario
    user.image = image;
    await user.save();

    return res.status(200).json({ message: "User image updated successfully" });
  } catch (error) {
    console.error("Error updating user image:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getUsersByMembership = async (req, res) => {
  try {
    const { membership } = req.query; // Obtén el parámetro de consulta 'membership'
    // Verificar si se especificó una membresía válida
    const allowedMemberships = ["standard", "premium"];
    if (membership && !allowedMemberships.includes(membership)) {
      return res.status(400).json({ error: "Invalid membership value" });
    }

    const users = await User.findAll({
      where: {
        membership: membership, // Filtrar por la membresía proporcionada
      },
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error getting users by membership:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// // Actualizar datos de usuario (PUT)
// const putUser = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { name, email, phone, image, membership, status } = req.body;

//         const updatedUser = await User.update(
//             { name, email, phone, image, membership, status },
//             { where: { id } }
//         );

//         if (updatedUser[0] === 1) {
//             res.json({ message: 'Usuario actualizado correctamente' });
//         } else {
//             res.status(404).json({ error: 'Usuario no encontrado' });
//         }
//     } catch (error) {
//         res.status(500).json({ error: 'Error al actualizar el usuario' });
//     }
// }

// // Eliminar usuario (DELETE)
// const deleteUser = async (req, res) => {
//     try {
//         const { id } = req.params;

//         const deletedUser = await User.destroy({ where: { id } });

//         if (deletedUser === 1) {
//             res.json({ message: 'Usuario eliminado correctamente' });
//         } else {
//             res.status(404).json({ error: 'Usuario no encontrado' });
//         }
//     } catch (error) {
//         res.status(500).json({ error: 'Error al eliminar el usuario' });
//     }
// }

// // Obtener usuarios por membresía (GET)
// const getUserMember = async (req, res) => {
//     try {
//         const { membership } = req.query;
//         const users = await User.findAll({ where: { membership } });

//         res.json(users);
//     } catch (error) {
//         res.status(500).json({ error: 'Error al obtener los usuarios' });
//     }
// }

module.exports = {
  postUser,
  getAllUsers,
  getUser,
  getUsersByName,
  getUsersByStatus,
  updateUserName,
  updateUserPhone,
  updateUserEmail,
  updateUserStatus,
  updateUserMembership,
  getUsersByMembership,
  updateUserImage,
  //   putUser, deleteUser, getUserMember
};
