const PlanTable = ({ plans, onEdit, onDelete }) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Clases</th>
                    <th>Beneficios</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {plans.map((plan) => (
                    <tr key={plan.id}>
                        <td>{plan.name}</td>
                        <td>${plan.value}</td>
                        <td>{plan.isUnlimited ? 'Ilimitadas' : plan.max_Class}</td>
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
                                <span>-</span>
                            )}
                        </td>
                        <td>
                            <button onClick={() => onEdit(plan)}>Editar</button>
                            <button onClick={() => onDelete(plan)}>Eliminar</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default PlanTable