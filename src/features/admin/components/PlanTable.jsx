import { useTranslation } from 'react-i18next'

const PlanTable = ({ plans, onEdit, onDelete }) => {
    const { t } = useTranslation('admin')

    return (
        <div className="admin-table-wrapper">
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>{t('table.name')}</th>
                        <th>{t('table.price')}</th>
                        <th>{t('table.classes')}</th>
                        <th>{t('table.benefits')}</th>
                        <th>{t('table.actions')}</th>
                    </tr>
                </thead>
                <tbody>
                    {plans.map((plan) => (
                        <tr key={plan.id}>
                            <td>{plan.name}</td>
                            <td>${plan.value}</td>
                            <td>{plan.isUnlimited ? t('table.unlimited') : plan.max_Class}</td>
                            <td>
                                {plan.benefits ? (
                                    <ul>
                                        {plan.benefits
                                            .split(',')
                                            .map(benefit => benefit.trim())
                                            .filter(benefit => benefit !== '')
                                            .map((benefit, index) => (
                                                <li key={index}>{benefit}</li>
                                            ))
                                        }
                                    </ul>
                                ) : (
                                    <span>{t('table.noBenefits')}</span>
                                )}
                            </td>
                            <td>
                                <div className="admin-table-actions">
                                    <button className="admin-btn-edit" onClick={() => onEdit(plan)}>{t('table.edit')}</button>
                                    <button className="admin-btn-delete" onClick={() => onDelete(plan)}>{t('table.delete')}</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default PlanTable