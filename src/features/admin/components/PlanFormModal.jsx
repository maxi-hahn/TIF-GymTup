import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import planService from '@/shared/services/planService'

const planSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').max(50, 'Máximo 50 caracteres'),
  value: z.coerce.number().positive('El precio debe ser mayor a 0'),
  max_Clases: z.coerce.number().int().min(1, 'Debe ser al menos 1'),
})

const PlanFormModal = ({ plan, onClose, onSaved }) => {
  const isEditing = !!plan
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: '',
      value: 0,
      max_Clases: 1,
    },
  })

  useEffect(() => {
    if (plan) {
      reset({
        name: plan.name,
        value: plan.value,
        max_Clases: plan.max_Class,
      })
    }
  }, [plan, reset])

  const onSubmit = async (formData) => {
    setServerError('')
    try {
      if (isEditing) {
        await planService.updatePlan(plan.id, formData)
      } else {
        await planService.createPlan(formData)
      }
      onSaved()
    } catch {
      setServerError('No se pudo guardar el plan. Intentá de nuevo.')
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
            <label htmlFor="max_Clases">Cantidad de clases</label>
            <input id="max_Clases" type="number" {...register('max_Clases')} />
            {errors.max_Clases && <span>{errors.max_Clases.message}</span>}
          </div>

          {serverError && <p>{serverError}</p>}

          <button type="button" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default PlanFormModal