import type { QRL } from "@builder.io/qwik";
import { $ } from "@builder.io/qwik";
import Swal from "sweetalert2";

interface UseAlerts {
  successAlert: QRL<(title: string, message: string) => void>;
  errorAlert: QRL<(title: string, message: string) => void>;
}

export const useAlerts = (): UseAlerts => {
  const successAlert = $((title: string, message: string) => {
    Swal.fire({
      title: title,
      text: message,
      icon: "success",
      confirmButtonText: "Ok",
    });
  });

  const errorAlert = $((title: string, message: string) => {
    Swal.fire({
      title: title,
      text: message,
      icon: "error",
      confirmButtonText: "Ok",
    });
  });

  return {
    successAlert,
    errorAlert,
  };
};
