import { showToast, ToastType } from "../ui/toast.js";

export class SystemLogger {
    constructor (sys) {
        this.system = sys;
    }

    format(title, msg, sys) {
        const s = this.system ?? sys;
        const formatted = `[${s}] ${title}: \n\t${msg}`;
        return formatted
    }

    log(title, msg, toast=false, sys) {
        console.log(this.format(title, msg, sys));

        if (toast) {
            showToast(ToastType.INFO, title, msg);
        }
    }

    succeed(title, msg, toast=false, sys) {
        console.log(this.format(title, msg, sys));

        if (toast) {
            showToast(ToastType.SUCCESS, title, msg);
        }
    }

    warn(title, msg, toast=false, sys) {
        console.warn(this.format(title, msg, sys));

        if (toast) {
            showToast(ToastType.WARNING, title, msg);
        }
    }

    error(title, msg, toast=false, sys) {
        console.error(this.format(title, msg, sys));

        if (toast) {
            showToast(ToastType.ERROR, title, msg);
        }
    }
}