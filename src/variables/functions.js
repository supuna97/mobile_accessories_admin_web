import Swal from "sweetalert2";
import Memory from "./memory";
import {USER_KEY, USER_ROLES} from "./constants";

class Functions {
    static successSwal(message) {
        Swal.fire({
            icon: 'success',
            title: 'Done!',
            text: message
        }).finally(() => undefined);
    }

    static errorSwal(message) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: message
        }).finally(() => undefined);
    }

    static errorSwalWithFooter(message, footerMessage) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: message,
            footer: '<a> '+ footerMessage +' </a>'
        }).finally(() => undefined);
    }

    static confirmSwal(confirmButtonText) {
        return Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: confirmButtonText
        });
    }

    static confirmInfoSwal(confirmButtonText) {
        return Swal.fire({
            title: 'Are you sure?',
            text: "Please confirm your action",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#309a30',
            cancelButtonColor: '#d33',
            confirmButtonText: confirmButtonText
        });
    }

    static branchVisible() {
        const userData = Memory.getValue(USER_KEY);
        return userData.userRole === USER_ROLES.HEAD_OFFICE_ADMIN;
    }

    static getBranchComboVisibility() {
        return this.branchVisible() ? "" : "none";
    }

}

export default Functions;