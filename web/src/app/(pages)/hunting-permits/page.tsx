"use client";

import HuntingPermits from "./hunting-permits";
import "./hunting-permits.css";
import { useLanguage } from "@/hooks/LanguageContext";




const HuntingPermitsPage = () => {
  const { t } = useLanguage();

  return (
    <div>
<HuntingPermits/>
<div className="real-exam"> <ul>
  {t("huntingPermits.examRequirementsTitle")}

<li>{t("huntingPermits.mentalHealthCert")}</li>
<li>{t("huntingPermits.idDocument")}</li>
<li>{t("huntingPermits.paymentReceipt")}</li>

</ul>
{t("huntingPermits.contactInfo")}
   {/* <a href="https://my.sa.gov.ge/auth" target="_blank" rel="noopener noreferrer" className="real-exam-button">
          ნამდვილ გამოცდაზე გადასვლა
        </a> */}
        
        </div>

    </div>
  );
};

export default HuntingPermitsPage;