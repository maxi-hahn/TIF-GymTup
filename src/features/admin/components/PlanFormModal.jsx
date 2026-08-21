import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import planService from '@/shared/services/planService'
import SubmitButton from '@/shared/components/SubmitButton'

const planSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').max(50, 'Máximo 50 caracteres'),
  value: z.coerce.number().positive('El precio debe ser mayor a 0'),
  max_Class: z.coerce.number().int().min(1, 'Debe ser al menos 1'),
  isUnlimited: z.boolean(),
  benefits: z.string().max(500, 'Máximo 500 caracteres').optional(),
})

const PlanFormModal = ({ plan, onClose, onSaved }) => {
  const isEditing = !!plan

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: '',
      value: 0,
      max_Class: 1,
      isUnlimited: false,
      benefits: '',
    },
  })

  const isUnlimited = watch('isUnlimited')

  useEffect(() => {
    if (plan) {
      reset({
        name: plan.name,
        value: plan.value,
        max_Class: plan.max_Class,
        isUnlimited: plan.isUnlimited,
        benefits: plan.benefits || '',
      })
    }
  }, [plan, reset])

  const onSubmit = async (formData) => {
    try {
      if (isEditing) {
        await planService.updatePlan(plan.id, formData)
        toast.success('Plan actualizado correctamente.')
      } else {
        await planService.createPlan(formData)
        toast.success('Plan creado correctamente.')
      }
      onSaved()
    } catch {
      toast.error('No se pudo guardar el plan. Intentá de nuevo.')
    }
  }

  return (
    <div>
      <div>
        <h2>{isEditing ? 'Editar plan' : 'Nuevo plan'}</h2>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <label htmlFor="name">Nombre</label>
            <input id="name" {...register('name')} />
            {errors.name && <span>{errors.name.message}</span>}
          </div>

          <div>
            <label htmlFor="value">Precio</label>
            <input id="value" type="number" step="0.01" {...register('value')} />
            {errors.value && <span>{errors.value.message}</span>}
          </div>

          <div>
            <label htmlFor="isUnlimited">
              <input 
                id="isUnlimited" 
                type="checkbox" 
                {...register('isUnlimited')} 
              />
              Plan ilimitado
            </label>
          </div>

          {/* Solo mostrar cantidad de clases si NO es ilimitado */}
          {!isUnlimited && (
            <div>
              <label htmlFor="max_Class">Cantidad de clases</label>
              <input id="max_Class" type="number" {...register('max_Class')} />
              {errors.max_Class && <span>{errors.max_Class.message}</span>}
            </div>
          )}

          <div>
            <label htmlFor="benefits">Beneficios</label>
            <textarea 
              id="benefits" 
              rows="4"
              placeholder="Ej: 3 horas de Personal Trainer, Acceso a todas las actividades"
              {...register('benefits')} 
            />
            {errors.benefits && <span>{errors.benefits.message}</span>}
            <small>Separá los beneficios con comas (,)</small>
          </div>

          <button type="button" onClick={onClose}>
            Cancelar
          </button>
          <SubmitButton loading={isSubmitting} loadingText="Guardando...">
            Guardar
          </SubmitButton>
        </form>
      </div>
    </div>
  )
}

export default PlanFormModal