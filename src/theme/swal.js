import Swal from "sweetalert2";

const cAlert = Swal.mixin({
    color: "#2c3e50",
    confirmButtonColor: "#1abc9c",
    cancelButtonColor: "#e74c3c",
    customClass: {
        popup: "custom-popup",
        title: "custom-title",
        content: "custom-content",
        confirmButton: "custom-confirm-btn",
        cancelButton: "custom-cancel-btn",
    },
});

export default cAlert;