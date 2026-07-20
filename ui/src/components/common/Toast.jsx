import { useToast } from "../../hooks/useToast";

const ToastStack = () => {
  const { toasts } = useToast();

  return (
    <div className="toast-stack">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.variant !== "default" ? `toast--${toast.variant}` : ""}`}>
          {toast.message}
        </div>
      ))}
    </div>
  );
};

export default ToastStack;
