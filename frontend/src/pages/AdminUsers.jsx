import { useEffect, useState } from "react";
import { FaUser, FaEdit, FaTrash } from "react-icons/fa";
import NavbarAdmin from "../components/NavbarAdmin";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import "../styles/AdminUsers.css";


const AdminUsers = () => {
  const { token } = useAuth();
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await fetch("http://localhost:5001/auth/users1", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Error al obtener usuarios");

        const data = await res.json();
        setUsuarios(data);
      } catch (err) {
        console.error("Error al obtener usuarios", err);
        Swal.fire("Error", "No se pudieron obtener los usuarios", "error");
      }
    };

    fetchUsuarios();
  }, [token]);

  const handleDelete = async (userId) => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      customClass: {
        confirmButton: "btn btn-danger px-4 py-2 rounded-pill fw-bold",
        cancelButton: "btn btn-secondary px-4 py-2 rounded-pill fw-bold ms-2",
      },
      buttonsStyling: false,
    });

    if (confirm.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:5001/auth/users1/${userId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Error al eliminar usuario");

        setUsuarios(usuarios.filter((usuario) => usuario._id !== userId));
        Swal.fire("Eliminado", "El usuario ha sido eliminado", "success");
      } catch (err) {
        console.error("Error al eliminar usuario", err);
        Swal.fire("Error", "No se pudo eliminar el usuario", "error");
      }
    }
  };

  const handleEdit = async (userId) => {
    const usuario = usuarios.find((u) => u._id === userId);

    const { value: formValues } = await Swal.fire({
      title: '<div class="modal-title-custom">Editar Usuario</div>',
      html: `
        <div class="modal-form-wrapper">
          <div class="form-group">
            <label>Nombre de usuario</label>
            <input id="swal-input1" class="form-control modal-input" value="${usuario.username}" />
          </div>
          <div class="form-group">
            <label>Correo electrónico</label>
            <input id="swal-input2" type="email" class="form-control modal-input" value="${usuario.email}" />
          </div>
          <div class="form-group">
            <label>Nueva contraseña</label>
            <input id="swal-input3" type="password" class="form-control modal-input" placeholder="(Opcional)" />
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'modal-popup-custom',
        confirmButton: 'modal-btn modal-btn-confirm',
        cancelButton: 'modal-btn modal-btn-cancel',
      },
      buttonsStyling: false,
      focusConfirm: false,
      preConfirm: () => {
        const username = document.getElementById("swal-input1").value.trim();
        const email = document.getElementById("swal-input2").value.trim();
        const password = document.getElementById("swal-input3").value;
    
        if (!username || !email) {
          Swal.showValidationMessage("Nombre de usuario y correo son obligatorios");
          return false;
        }
    
        return { username, email, password };
      },
    });
    

    if (formValues) {
      try {
        const response = await fetch(`http://localhost:5001/auth/users1/${userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formValues),
        });

        if (!response.ok) throw new Error("Error al actualizar usuario");

        setUsuarios((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, ...formValues } : u))
        );

        Swal.fire({
          icon: "success",
          title: "Usuario actualizado",
          text: "Los cambios se guardaron correctamente",
          confirmButtonColor: "#198754",
        });
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "No se pudo actualizar el usuario", "error");
      }
    }
  };

  return (
    <div className="container">
      <NavbarAdmin />
      <div className="container my-5">
        <h2 className="text-center fw-bold mb-4">Usuarios Registrados</h2>
        <div className="row">
          {usuarios.map((u) => (
            <div key={u._id} className="col-md-4 mb-4">
              <div className="card p-3 shadow-sm">
                <div className="d-flex justify-content-between align-items-center">
                  <FaUser size={50} />
                  <div className="d-flex flex-column align-items-start ms-3">
                    <strong>{u.username}</strong>
                    <span>{u.email}</span>
                    <span>Rol: {u.role}</span>
                  </div>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm" onClick={() => handleEdit(u._id)}>
                      <FaEdit /> Editar
                    </button>
                    <button className="btn1 btn btn-sm" onClick={() => handleDelete(u._id)}>
                      <FaTrash /> Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
