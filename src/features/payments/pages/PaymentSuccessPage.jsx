import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './PaymentSuccessPage.css';

const PaymentSuccessPage = () => {
  const navigate = useNavigate()
  const { updateUser } = useAuth()
  const [searchParams] = useSearchParams()
  
  const status = searchParams.get('status') || 'success'

  useEffect(() => {
    const refreshUserPlan = async () => {
      try {
        const planStatus = await userService.getMyPlanStatus()
        
        // Actualizar el usuario en AuthContext
        updateUser({
          hasPlan: true,
          planName: planStatus.planName,
        })
        
        // Disparar evento para que Navbar actualice
        window.dispatchEvent(new Event('planUpdated'))
      } catch (error) {
        console.error('Error actualizando plan:', error)
      }
    }
    
    if (status === 'approved' || status === 'success') {
      refreshUserPlan()
    }
  }, [status, updateUser])

  return (
    <div className="payment-result-container">
      <div className="payment-result-card">
        {isSuccess ? (
          <>
            <div className="payment-icon success-icon">✓</div>
            <h1 className="payment-title">
              ¡Pago realizado correctamente!
            </h1>
            <p className="payment-message">
              Tu plan ya está activo. Ya puedes inscribirte a las clases.
            </p>
          </>
        ) : (
          <>
            <div className="payment-icon error-icon">✕</div>
            <h1 className="payment-title">
              No se pudo completar el pago
            </h1>
            <p className="payment-message">
              Hubo un problema al procesar tu pago. Por favor, intenta nuevamente.
            </p>
          </>
        )}
        
        <div className="payment-buttons">
          <button
            onClick={() => navigate('/plans')}
            className="payment-button primary-button"
          >
            Volver a Planes
          </button>
          <button
            onClick={() => navigate('/classes')}
            className="payment-button secondary-button"
          >
            Ver Clases
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;