import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import planService from '@/shared/services/planService'
import SubmitButton from '@/shared/components/SubmitButton'

const PlanFormModal = ({ plan, onClose, onSaved }) => {
  const { t } = useTranslation('admin')
  const isEditing = !!plan

  const planSchema = z.object({
    name: z.string().min(1, t('form.nameRequired')).max(50, t('form.nameMax')),
    value: z.coerce.number().positive(t('form.priceMin')),
    max_Class: z.coerce.number().int().min(1, t('form.classesMin')),
    isUnlimited: z.boolean(),
    benefits: z.string().max(500, t('form.benefitsMax')).optional(),
  })

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
        toast.success(t('form.updateSuccess'))
      } else {
        await planService.createPlan(formData)
        toast.success(t('form.createSuccess'))
      }
      onSaved()
    } catch {
      toast.error(t('form.saveError'))
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2 className="modal-title">{isEditing ? t('form.editTitle') : t('form.newTitle')}</h2>

        <form className="modal-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="modal-field">
            <label htmlFor="name">{t('form.name')}</label>
            <input id="name" {...register('name')} />
            {errors.name && <span className="modal-field-error">{errors.name.message}</span>}
          </div>

          <div className="modal-field">
            <label htmlFor="value">{t('form.price')}</label>
            <input id="value" type="number" step="0.01" {...register('value')} />
            {errors.value && <span className="modal-field-error">{errors.value.message}</span>}
          </div>

          <div className="modal-field modal-field-checkbox">
            <label htmlFor="isUnlimited">
              <input
                id="isUnlimited"
                type="checkbox"
                {...register('isUnlimited')}
              />
              {t('form.unlimitedPlan')}
            </label>
          </div>

          {!isUnlimited && (
            <div className="modal-field">
              <label htmlFor="max_Class">{t('form.classesAmount')}</label>
              <input id="max_Class" type="number" {...register('max_Class')} />
              {errors.max_Class && <span className="modal-field-error">{errors.max_Class.message}</span>}
            </div>
          )}

          <div className="modal-field">
            <label htmlFor="benefits">{t('form.benefits')}</label>
            <textarea
              id="benefits"
              rows="4"
              placeholder={t('form.benefitsPlaceholder')}
              {...register('benefits')}
            />
            {errors.benefits && <span className="modal-field-error">{errors.benefits.message}</span>}
            <small>{t('form.benefitsHint')}</small>
          </div>

          <div className="modal-actions">
            <button type="button" className="modal-cancel" onClick={onClose}>
              {t('form.cancel')}
            </button>
            <SubmitButton loading={isSubmitting} loadingText={t('form.saving')}>
              {t('form.save')}
            </SubmitButton>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PlanFormModal