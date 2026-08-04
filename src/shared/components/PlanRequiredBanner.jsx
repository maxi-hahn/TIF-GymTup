import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

const PlanRequiredBanner = () => {

    const navigate = useNavigate()
    const { t } = useTranslation("classes")

    return (
        <div className="plan-banner">

            <div>
                <strong>{t("planRequiredTitle")}</strong>

                <p>{t("planRequiredDescription")}</p>
            </div>

            <button onClick={() => navigate("/plans")}>
                {t("viewPlans")}
            </button>

        </div>
    )
}

export default PlanRequiredBanner