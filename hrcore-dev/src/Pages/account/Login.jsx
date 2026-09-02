import React, { useState } from "react";
import {
  Phone,
  Send,
  ArrowLeft,
  CheckCircle,
  XCircle,
  RotateCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [step, setStep] = useState("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const addNotification = (type, message) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    const phoneDigits = phoneNumber.replace(/\D/g, "");
    
    if (phoneDigits.length !== 10) {
      addNotification("error", "Le numéro doit contenir 10 chiffres (ex: 0612345678)");
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/api/verify-number', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          phone_number: phoneDigits
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Numéro introuvable");
      }

      addNotification("success", `Code OTP envoyé au ${phoneNumber}`);
      setStep("verification");
    } catch (error) {
      addNotification("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    if (!verificationCode || verificationCode.length !== 5) {
      addNotification("error", "Le code doit contenir 5 chiffres");
      return;
    }

    setLoading(true);
    
    try {
      const phoneDigits = phoneNumber.replace(/\D/g, "");
      const response = await fetch('http://localhost:8000/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          phone_number: phoneDigits,
          code_sms: verificationCode
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Code OTP invalide");
      }

      addNotification("success", "Connexion réussie !");
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("employee", JSON.stringify(data.employee));
      navigate("/employees-management");
    } catch (error) {
      addNotification("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      const phoneDigits = phoneNumber.replace(/\D/g, "");
      const response = await fetch('http://localhost:8000/api/verify-number', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          phone_number: phoneDigits
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'envoi du code");
      }

      addNotification("info", "Nouveau code OTP envoyé !");
    } catch (error) {
      addNotification("error", error.message);
    }
  };

  const formatPhoneNumber = (value) => {
    const phone = value.replace(/\D/g, "");
    if (phone.length <= 10) {
      return phone.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4 $5");
    }
    return phone;
  };

  const Notification = ({ type, message, onClose }) => {
    const icons = {
      success: <CheckCircle className="w-5 h-5" />,
      error: <XCircle className="w-5 h-5" />,
      info: <RotateCw className="w-5 h-5" />,
    };

    const colors = {
      success: "bg-green-100 text-green-800 border-green-200",
      error: "bg-red-100 text-red-800 border-red-200",
      info: "bg-blue-100 text-blue-800 border-blue-200",
    };

    return (
      <div
        className={`flex items-start p-4 mb-2 rounded-lg border ${colors[type]} transition-all duration-300 transform hover:scale-[1.02] shadow-md`}
      >
        <div className="mr-2 mt-0.5">{icons[type]}</div>
        <div className="flex-1 text-sm font-medium">{message}</div>
        <button
          onClick={onClose}
          className="ml-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="fixed top-4 right-4 w-80 z-50 space-y-2">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            type={notification.type}
            message={notification.message}
            onClose={() =>
              setNotifications((prev) =>
                prev.filter((n) => n.id !== notification.id)
              )
            }
          />
        ))}
      </div>

      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {step === "phone" ? "Connexion" : "Vérification"}
            </h1>
            <p className="text-gray-600">
              {step === "phone"
                ? "Entrez votre numéro de téléphone pour continuer"
                : `Code envoyé au ${phoneNumber}`}
            </p>
          </div>

          {step === "phone" ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Numéro de téléphone
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    id="phone"
                    value={phoneNumber}
                    onChange={(e) =>
                      setPhoneNumber(formatPhoneNumber(e.target.value))
                    }
                    placeholder="06 12 34 56 78"
                    className="w-full pl-7 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Envoyer le code
                  </>
                )}
              </button>
            </form>
          ) : (
            <div>
              <button
                onClick={() => setStep("phone")}
                className="flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Retour
              </button>

              <form onSubmit={handleVerificationSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="code"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Code de vérification
                  </label>
                  <input
                    type="text"
                    id="code"
                    value={verificationCode}
                    onChange={(e) =>
                      setVerificationCode(
                        e.target.value.replace(/\D/g, "").slice(0, 5))
                    }
                    placeholder="12345"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-center text-2xl font-mono tracking-widest"
                    maxLength="5"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Entrez le code à 5 chiffres reçu par SMS
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Vérifier
                    </>
                  )}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendCode}
                    className="text-sm text-blue-600 hover:text-blue-700 underline transition-colors"
                  >
                    Renvoyer le code
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              En continuant, vous acceptez nos conditions d'utilisation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;